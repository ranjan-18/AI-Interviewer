from ..services.llm_client import LLMClient
from ..utils.prompt_loader import HR_EVALUATOR_PROMPT

class HREvaluatorAgent:
    def __init__(self):
        self.llm_client = LLMClient()

    async def evaluate(self, hr_transcript: str) -> dict:
        prompt = f"""
        Interview Transcript (HR or Combined):
        {hr_transcript[:8000]}
        
        Evaluate Soft Skills & Culture Fit.
        
        IMPORTANT: This might be a partial interview or only contain the Technical portion if the candidate quit early.
        - If NO HR questions were asked, evaluate Communication Style, Confidence, and Clarity based on their technical explanations.
        - Explicitly state "Limited Data - Early Termination" if applicable.
        """
        return await self.llm_client.generate_json(prompt, HR_EVALUATOR_PROMPT)
