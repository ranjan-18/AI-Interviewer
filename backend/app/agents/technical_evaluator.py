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
        {technical_transcript}
        
        Evaluate the candidate on technical skills based on the SYSTEM PROMPT criteria.
        Return structured JSON with scores and feedback.
        """
        return await self.llm_client.generate_json(prompt, TECHNICAL_EVALUATOR_PROMPT)
