from ..services.llm_client import LLMClient
from .resume_analyzer import ResumeAnalyzerAgent
from .interviewer import InterviewerAgent
from .followup import FollowupAgent
from .technical_evaluator import TechnicalEvaluatorAgent
from .hr_evaluator import HREvaluatorAgent
from .feedback_coach import FeedbackCoachAgent
from ..utils.prompt_loader import ORCHESTRATOR_PROMPT
import json
import logging

logger = logging.getLogger(__name__)

class AgentOrchestrator:
    def __init__(self):
        self.llm_client = LLMClient()
        self.resume_analyzer_agent = ResumeAnalyzerAgent()
        self.interviewer_agent = InterviewerAgent()
        self.followup_agent = FollowupAgent()
        self.technical_evaluator = TechnicalEvaluatorAgent()
        self.hr_evaluator = HREvaluatorAgent()
        self.feedback_coach = FeedbackCoachAgent()

    async def analyze_resume(self, resume_text: str) -> dict:
        return await self.resume_analyzer_agent.analyze(resume_text)


    async def determine_next_stage(self, current_round: str, current_step: int, history: list, items: list = None, has_achievements: bool = False) -> str:
        """
        Determines the stage based on the number of completed interaction steps.
        current_step 0 = Introduction / Tell me about yourself.
        """
        if current_round == "hr":
            return "behavioral"
        
        # Calculate Resume Stage duration based on item types
        exp_count = sum(1 for i in (items or []) if "company" in i)
        proj_count = sum(1 for i in (items or []) if "company" not in i)
        
        # 3 questions for Exp, 4 for Projects
        resume_stage_end = (exp_count * 3) + (proj_count * 4) + 1 # +1 for intro answer
        
        # DSA Stage: usually 2 questions
        dsa_stage_end = resume_stage_end + 2
        
        # Achievements Stage
        achievements_stage_end = dsa_stage_end + (1 if has_achievements else 0)
        
        if current_step == 0:
            return "intro"
        elif 1 <= current_step < resume_stage_end:
            return "resume_deep_dive"
        elif resume_stage_end <= current_step < dsa_stage_end:
            return "dsa_tech"
        elif has_achievements and dsa_stage_end <= current_step < achievements_stage_end:
            return "achievements"
        else:
            return "wrap_up_technical"

    async def generate_response(
        self, 
        current_round: str, 
        last_question: str, 
        candidate_answer: str, 
        resume_context: str,
        current_step: int = 0,
        interview_history: list = None,
        project_count: int = 0,
        items: list = None,
        has_achievements: bool = False
    ) -> str:
        logger.info(f"Generating response: round={current_round}, step={current_step}, project_count={project_count}, has_achievements={has_achievements}")
        
        if current_round == "completed":
            return "The interview is already completed. Thank you!"

        if project_count == 0:
            project_count = 2 # fallback

        # 1. Determine the stage
        stage = await self.determine_next_stage(current_round, current_step, interview_history, items, has_achievements)
        
        # Special logic for current item
        current_item_str = "General"
        item_step = 1
        total_item_questions = 3

        if stage == "resume_deep_dive" and items:
            # We need to find which item we are on by counting the steps
            running_step = 1 # step 0 was intro
            found = False
            for idx, item in enumerate(items):
                is_exp = "company" in item
                limit = 3 if is_exp else 4
                if running_step <= current_step < (running_step + limit):
                    current_item = item
                    item_step = (current_step - running_step) + 1
                    total_item_questions = limit
                    item_type = "Experience" if is_exp else "Project"
                    current_item_str = f"{item_type} {idx + 1}: {json.dumps(current_item)}"
                    logger.info(f"Focusing on {item_type} {idx + 1}: Step {item_step}/{limit}")
                    found = True
                    break
                running_step += limit

        # 2. Evaluate current answer
        answer_analysis = "The answer was good. Move forward to the next point promptly."
        
        if stage == "intro":
            # DIRECT JUMP: Do not ask follow-ups about intro. Move immediately to first resume item.
            if items and len(items) > 0:
                current_item = items[0]
                is_exp = "company" in current_item
                total_item_questions = 3 if is_exp else 4
                item_type = "Experience" if is_exp else "Project"
                current_item_str = f"{item_type} 1: {json.dumps(current_item)}"
                answer_analysis = f"Acknowledge the introduction BRIEFLY and transition IMMEDIATELY to the FIRST {item_type} item from the resume. No generic intro follow-ups."
            else:
                answer_analysis = "Transition to their background. Skip follow-up background questions."

        # Override for DSA Stage
        elif stage == "dsa_tech":
            current_item_str = "Technical Problem Solving (DSA)"
            # Recalculate DSA start
            exp_count = sum(1 for i in (items or []) if "company" in i)
            proj_count = sum(1 for i in (items or []) if "company" not in i)
            resume_stage_end = (exp_count * 3) + (proj_count * 4) + 1
            dsa_step = current_step - resume_stage_end + 1
            
            if dsa_step == 1:
                answer_analysis = (
                    "Provide a HIGH-FREQUENCY MEDIUM difficulty DSA problem (e.g., Two Sum, Linked List Cycle, or Valid Parentheses). "
                    "Format the problem in GEEKSFORGEEKS STYLE. "
                    "Explicitly state: 'You have 8 minutes. Write only the core function logic.' "
                )
            elif dsa_step == 2:
                answer_analysis = (
                    "Provide a second HIGH-FREQUENCY MEDIUM difficulty DSA problem from a DIFFERENT topic (e.g., Trees/Graphs). "
                    "Format it in GEEKSFORGEEKS STYLE. "
                    "Explicitly state: 'Second challenge. 8 minutes. Focus on function logic.' "
                )
        
        elif stage == "achievements":
            current_item_str = "Final Round: Achievements & Behavioral"
            answer_analysis = (
                "TRANSITION TO HR ROUND. Discuss the candidate's most significant achievements or cultural fit. "
                "Keep it professional, encouraging, and move towards session conclusion."
            )

        elif current_step >= 0:
            # Default behavior for resume deep dive
            answer_analysis = "Acknowledge the candidate's last answer very briefly and move to the next question. FOCUS ON TECHNICAL DEPTH."
            
            try:
                # Use followup agent to see if we MUST probe, but keep it minimal to avoid getting stuck
                quality_response = await self.followup_agent.evaluate_answer(last_question, candidate_answer, resume_context)
                quality = quality_response.get("quality", "good")
                
                if quality == "shallow":
                    answer_analysis = f"Briefly acknowledge, then ask one sharp technical probe about the missing implementation detail: {quality_response.get('followup_question')}"
                elif quality == "incorrect":
                    answer_analysis = f"Quickly correct the technical point and move to the next question immediately. Do not linger."
                elif quality == "buzzword_bluffing":
                    answer_analysis = f"Acknowledge, but ask for one concrete implementation detail to verify understanding: {quality_response.get('followup_question')}"
            except Exception as e:
                logger.error(f"Followup analysis failed: {e}")

        # 3. Compile history
        history_str = "\n".join([f"Q: {item['question']}\nA: {item['answer']}" for item in (interview_history or [])])
        
        # 4. Generate response
        try:
            return await self.interviewer_agent.generate_response(
                current_round=current_round,
                stage=stage,
                resume_context=resume_context,
                conversation_history=history_str,
                last_answer=candidate_answer,
                followup_instruction=answer_analysis,
                current_item=current_item_str,
                item_step=item_step,
                total_item_questions=total_item_questions
            )
        except Exception as e:
            logger.error(f"Error in interviewer_agent: {e}")
            return "I see. Let's move to the next part of your resume."

    async def generate_feedback(self, session_data: dict) -> str:
        """
        Orchestrates the final evaluation.
        """
        history = session_data.get("history", [])
        technical_transcript = ""
        hr_transcript = ""
        
        for item in history:
            text = f"Interviewer: {item.get('question')}\nCandidate: {item.get('answer')}\n\n"
            if item.get("round") == "technical":
                technical_transcript += text
            else:
                hr_transcript += text

        resume_context = session_data.get("resume_context", "")

        technical_eval = await self.technical_evaluator.evaluate(technical_transcript, resume_context)
        hr_eval = await self.hr_evaluator.evaluate(hr_transcript)
        
        full_transcript = technical_transcript + hr_transcript
        return await self.feedback_coach.generate_report(technical_eval, hr_eval, full_transcript, resume_context)
