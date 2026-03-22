const fs = require('fs');
const path = require('path');

const loadPrompt = (filename) => {
    const promptsDir = path.join(__dirname, '..', 'prompts');
    const filePath = path.join(promptsDir, filename);
    
    if (!fs.existsSync(filePath)) {
        return "";
    }
    
    return fs.readFileSync(filePath, 'utf-8');
};

module.exports = {
    ORCHESTRATOR_PROMPT: loadPrompt("orchestrator.txt"),
    RESUME_ANALYZER_PROMPT: loadPrompt("resume_analyzer.txt"),
    INTERVIEWER_PROMPT: loadPrompt("interviewer.txt"),
    FOLLOWUP_PROMPT: loadPrompt("followup.txt"),
    TECHNICAL_EVALUATOR_PROMPT: loadPrompt("technical_evaluator.txt"),
    HR_EVALUATOR_PROMPT: loadPrompt("hr_evaluator.txt"),
    FEEDBACK_COACH_PROMPT: loadPrompt("feedback_coach.txt"),
    HR_INTERVIEWER_PROMPT: loadPrompt("hr_interviewer.txt")
};
