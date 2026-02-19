from ..services.llm_client import LLMClient
from ..utils.prompt_loader import FOLLOWUP_PROMPT

class FollowupAgent:
    def __init__(self):
        self.llm_client = LLMClient()

    async def evaluate_answer(self, last_question: str, answer: str, resume_context: str) -> dict:
        prompt = f"""
        Question: "{last_question}"
        Candidate Answer: "{answer}"
        Resume Context: {resume_context[:1000]}
        
        Is this answer "shallow" or "good"? If shallow, what is the probe?
        """
        # The prompt now expects the agent to return JSON with quality and followup_question
        response = await self.llm_client.generate_json(prompt, FOLLOWUP_PROMPT)
        return response

    async def generate_followup(self, last_question: str, answer: str, resume_context: str) -> str:
        # We can call evaluate_answer and reuse the followup_question if it exists
        eval_result = await self.evaluate_answer(last_question, answer, resume_context)
        return eval_result.get("followup_question") or "Could you tell me more about that?"
