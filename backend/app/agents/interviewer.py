from ..services.llm_client import LLMClient
from ..utils.prompt_loader import INTERVIEWER_PROMPT

class InterviewerAgent:
    def __init__(self):
        self.llm_client = LLMClient()

    async def generate_response(
        self, 
        current_round: str, 
        stage: str,
        resume_context: str,
        conversation_history: str,
        last_answer: str,
        followup_instruction: str = "",
        **kwargs
    ) -> str:
        
        item_step = kwargs.get('item_step', 1)
        total_steps = kwargs.get('total_item_questions', 2)
        
        prompt = f"""
        # CONTEXT
        Current Round: {current_round}
        Current Stage: {stage}
        Current Item to Discuss: {kwargs.get('current_item', 'General')} (Question {item_step} of {total_steps})
        Resume Context: {resume_context[:3000]}
        
        # CONVERSATION STATE
        Previous History:
        {conversation_history}
        
        Candidate's Last Answer: {last_answer}
        
        # SYSTEM GUIDANCE
        Follow-up Instruction: {followup_instruction}
        
        # REAL-WORLD INSTRUCTION
        Perform your role as a senior tech interviewer. 
        Focus on technical depth, trade-offs, and production scenarios.
        
        CRITICAL RULES:
        1. **STRICT QUESTION LIMIT**: You are on question {item_step} of {total_steps} for the current item. 
           - Experience item: Exactly 3 questions.
           - Project item: Exactly 4 questions.
        2. **MOVE FORWARD**: Do NOT get stuck on one detail. If the candidate gives a good answer, acknowledge it and immediately move to the next question or item.
        3. **TOP-TO-BOTTOM**: Follow the resume structure (Experience -> Projects -> Achievements). 
        4. **NO REPETITION**: Do not ask something already covered.
        5. **TRANSITIONS**: 
           - When moving from Experience to Projects, say "Next, let's look at your projects."
           - When moving to DSA, say "Now, let's move to technical problem-solving."
        6. **ONLY ONE QUESTION**: Ask exactly one sharp, concise question. NEVER ask multi-part questions.
        """
        
        return await self.llm_client.generate_completion(prompt, INTERVIEWER_PROMPT)
