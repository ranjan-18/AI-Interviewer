from ..services.llm_client import LLMClient
from ..utils.prompt_loader import HR_EVALUATOR_PROMPT

class HREvaluatorAgent:
    def __init__(self):
        self.llm_client = LLMClient()

    async def evaluate(self, hr_transcript: str) -> dict:
        prompt = f"""
        HR Round Transcript:
        {hr_transcript}
        
        Evaluate the candidate on soft skills and culture fit based on the SYSTEM PROMPT criteria.
        Return structured JSON with scores and feedback.
        """
        return await self.llm_client.generate_json(prompt, HR_EVALUATOR_PROMPT)
