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
        Full Transcript:
        {full_transcript[:8000]}
        
        Generate the FINAL FEEDBACK REPORT.
        
        CRITICAL RULES FOR HONESTY & UTILITY:
        1. **Gap Analysis**: For every major question asked, explicit compare:
           - "What You Said": (Summarize their actual answer)
           - "The Senior-Level Answer": (Explain the correct technical depth/nuance they missed)
        2. **No Participation Awards**: If an answer was basic, call it "Junior-level". Be direct.
        3. **Correctness Check**: If they were wrong, explicitly say "This is incorrect because X, Y, Z."
        
        If the interview was short/partial, just apply this rigorous standard to the few questions answered.
        """
        return await self.llm_client.generate_completion(prompt, FEEDBACK_COACH_PROMPT)
