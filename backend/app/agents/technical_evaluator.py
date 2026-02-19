from ..services.llm_client import LLMClient
from ..utils.prompt_loader import TECHNICAL_EVALUATOR_PROMPT

class TechnicalEvaluatorAgent:
    def __init__(self):
        self.llm_client = LLMClient()

    async def evaluate(self, technical_transcript: str, resume_context: str = "") -> dict:
        prompt = f"""
        RESUME SECTION:
        {resume_context[:4000]}
        
        Technical Round Transcript:
        {technical_transcript[:8000]}
        
        Evaluate the candidate on technical skills based on the SYSTEM PROMPT criteria.
        Return structured JSON with scores and feedback.
        
        IMPORTANT: If the transcript appears incomplete or the interview ended early, evaluate ONLY based on the available data. 
        Do not penalized simply for being short, but evaluate the quality of what WAS observed.
        
        CRITICAL INSTRUCTIONS FOR HONESTY:
        1. ZERO HALLUCINATION: Grade ONLY what the candidate actually said in the transcript. If they didn't mention a concept, it is a MISS.
        2. BE BRUTALLY HONEST: Do not give participation points. If an answer is vague or wrong, mark it as such.
        3. PROVIDE "IDEAL ANSWERS": For every significant technical question where the candidate struggled, explicitly state what a Senior Engineer would have answered.
        
        Structure your JSON to include "candidate_performance" vs "gold_standard_answer" for key topics.
        State clearly in the summary if the evaluation is based on a partial interview.
        """
        return await self.llm_client.generate_json(prompt, TECHNICAL_EVALUATOR_PROMPT)
