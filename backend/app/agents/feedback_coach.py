from ..services.llm_client import LLMClient
from ..utils.prompt_loader import FEEDBACK_COACH_PROMPT

class FeedbackCoachAgent:
    def __init__(self):
        self.llm_client = LLMClient()

    async def generate_report(self, technical_eval: dict, hr_eval: dict, full_transcript: str, resume_context: str = "") -> str:
        prompt = f"""
        RESUME SECTION:
        {resume_context[:4000]}
        
        Technical Evaluation: {technical_eval}
        HR Evaluation: {hr_eval}
        Full Transcript Summary: {full_transcript[:3000]} (truncated if too long)
        
        Generate the FINAL FEEDBACK REPORT structured as per instructions.
        """
        return await self.llm_client.generate_completion(prompt, FEEDBACK_COACH_PROMPT)
