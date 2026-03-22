const llmService = require('../services/llmService');
const prompts = require('../utils/promptLoader');

class AgentOrchestrator {
  sanitizeRef(text) {
    if (!text) return "";
    return text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]')
               .replace(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '[PHONE]');
  }

  async analyzeResume(resumeText) {
    const safeText = this.sanitizeRef(resumeText);
    const prompt = `Here is the candidate's resume text:\n\n${safeText}`;
    const response = await llmService.generateJson(prompt, prompts.RESUME_ANALYZER_PROMPT);
    
    const defaultStructure = {
      skills: [],
      projects: [],
      experience: [],
      achievements: [],
      education: [],
      strengths: [],
      weaknesses: [],
      interview_plan: {
        intro: [],
        projects: [],
        technical: [],
        hr: []
      }
    };

    if (response.error) {
      return defaultStructure;
    }

    // Merge with default Structure
    return { ...defaultStructure, ...response };
  }

  async determineNextStage(currentRound, currentStep, history, items = [], hasAchievements = false) {
    if (currentRound === 'hr') return 'behavioral';

    const expCount = items.filter(i => JSON.stringify(i).toLowerCase().includes('company')).length;
    const projCount = items.length - expCount;

    const resumeStageEnd = (expCount * 3) + (projCount * 4) + 1;
    const dsaStageEnd = resumeStageEnd + 2;
    const achievementsStageEnd = dsaStageEnd + (hasAchievements ? 1 : 0);
    const hrStageEnd = achievementsStageEnd + 14;

    if (currentStep === 0) return 'intro';
    if (currentStep >= 1 && currentStep < resumeStageEnd) return 'resume_deep_dive';
    if (currentStep >= resumeStageEnd && currentStep < dsaStageEnd) return 'dsa_tech';
    if (hasAchievements && currentStep >= dsaStageEnd && currentStep < achievementsStageEnd) return 'achievements';
    if (currentStep >= achievementsStageEnd && currentStep < hrStageEnd) return 'hr_round';
    
    return 'wrap_up_technical';
  }

  async generateResponse(params) {
    let { 
      currentRound, lastQuestion, candidateAnswer, resumeContext, 
      currentStep = 0, interviewHistory = [], projectCount = 0, 
      items = [], hasAchievements = false 
    } = params;

    if (currentRound === 'completed') {
      return { response: "The interview is already completed. Thank you!", stage: "completed" };
    }

    if (projectCount === 0) projectCount = 2;

    const stage = await this.determineNextStage(currentRound, currentStep, interviewHistory, items, hasAchievements);
    
    let currentItemStr = "General";
    let itemStep = 1;
    let totalItemQuestions = 3;

    if (stage === 'resume_deep_dive' && items.length > 0) {
      let runningStep = 1;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const isExp = JSON.stringify(item).toLowerCase().includes('company');
        const limit = isExp ? 3 : 4;
        
        if (currentStep >= runningStep && currentStep < runningStep + limit) {
          itemStep = (currentStep - runningStep) + 1;
          totalItemQuestions = limit;
          const itemType = isExp ? 'Experience' : 'Project';
          
          if (itemStep === 1) {
            currentItemStr = `${itemType} ${i + 1} (Overview): ${JSON.stringify(item)}`;
          } else if (itemStep === 2) {
            currentItemStr = `${itemType} ${i + 1} (Deep Dive): ${JSON.stringify(item)}`;
          } else if (itemStep === 3) {
            currentItemStr = `${itemType} ${i + 1} (Architecture): ${JSON.stringify(item)}`;
          } else {
            currentItemStr = `${itemType} ${i + 1} (Outcome): ${JSON.stringify(item)}`;
          }
          break;
        }
        runningStep += limit;
      }
    }

    let answerAnalysis = "The answer was good. Move forward to the next point promptly.";

    if (stage === 'intro') {
      if (items.length > 0) {
        const isExp = JSON.stringify(items[0]).toLowerCase().includes('company');
        const itemType = isExp ? 'Experience' : 'Project';
        answerAnalysis = `Acknowledge intro and transition to FIRST ${itemType} item. No generic follow-ups.`;
      } else {
        answerAnalysis = "Transition to their background. Skip follow-up background questions.";
      }
    } else if (stage === 'dsa_tech') {
      answerAnalysis = "Provide a HIGH-FREQUENCY MEDIUM DSA problem. 8 minutes limit. GeeksForGeeks style.";
    } else if (stage === 'achievements') {
      answerAnalysis = "Transition to achievements. Ask one question about their most proud professional moment.";
    } else if (stage === 'hr_round') {
      answerAnalysis = "Ask the next HR behavioral question based on standard templates.";
    } else {
      answerAnalysis = "Acknowledge the answer and move strictly to the next planned question. Do not probe deeper.";
    }

    let historyStr = interviewHistory.map(h => `Q: ${h.question}\nA: ${h.answer}`).join('\n');
    if (lastQuestion && candidateAnswer) {
      historyStr += `\nQ: ${lastQuestion}\nA: ${candidateAnswer}`;
    }

    try {
      let prompt = "";
      let systemPrompt = prompts.INTERVIEWER_PROMPT;
      
      if (stage === 'hr_round') {
        systemPrompt = prompts.HR_INTERVIEWER_PROMPT;
        prompt = `
        # CONTEXT
        Current Stage: HR & Behavioral Round
        Brief Context: Candidate is a software engineer.
        
        # HISTORY
        ${historyStr}
        
        # INSTRUCTION
        ${answerAnalysis}
        `;
      } else {
        prompt = `
        # CONTEXT
        Current Round: ${currentRound}
        Current Stage: ${stage}
        Current Item: ${currentItemStr} (Question ${itemStep} of ${totalItemQuestions})
        
        # HISTORY
        ${historyStr}
        
        # SYSTEM GUIDANCE
        Follow-up Instruction: ${answerAnalysis}
        `;
      }

      const responseText = await llmService.generateCompletion(prompt, systemPrompt);
      return { response: responseText, stage: stage };
    } catch (error) {
      console.error(`Error in orchestrator JS: ${error.message}`);
      return { response: "I see. Let's move to the next part of your resume.", stage: stage };
    }
  }

  async generateFeedback(sessionData) {
    const { history = [], resumeContext = "" } = sessionData;
    let technicalTranscript = "";
    let hrTranscript = "";

    for (const item of history) {
      const text = `Interviewer: ${item.question}\nCandidate: ${item.answer}\n\n`;
      if (item.round === 'technical') technicalTranscript += text;
      else hrTranscript += text;
    }

    const fullTranscript = technicalTranscript + hrTranscript;
    if (!fullTranscript) return "No interview data available to generate a report.";

    let technicalEval = "Evaluation unavailable.";
    try {
      const safeResume = this.sanitizeRef(resumeContext);
      const prompt = `Resume: ${safeResume}\n\nTranscript: ${fullTranscript}`;
      technicalEval = await llmService.generateCompletion(prompt, prompts.TECHNICAL_EVALUATOR_PROMPT);
    } catch (e) {}

    let hrEval = "HR evaluation unavailable.";
    try {
      hrEval = await llmService.generateCompletion(hrTranscript || fullTranscript, prompts.HR_EVALUATOR_PROMPT);
    } catch (e) {}

    try {
      const safeResume = this.sanitizeRef(resumeContext);
      const coachPrompt = `Technical Eval: ${technicalEval}\n\nHR Eval: ${hrEval}\n\nTranscript: ${fullTranscript}\n\nResume: ${safeResume}`;
      return await llmService.generateCompletion(coachPrompt, prompts.FEEDBACK_COACH_PROMPT);
    } catch (e) {
      return "Final report compilation failed.";
    }
  }
}

module.exports = new AgentOrchestrator();
