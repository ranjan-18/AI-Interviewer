from ..services.llm_client import LLMClient
from ..utils.prompt_loader import INTERVIEWER_PROMPT, HR_INTERVIEWER_PROMPT

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
        
        if stage == "break_stage":
            # Simple prompt to mediate the break choice
            prompt = f"""
            # CONTEXT
            Current Stage: Intermission / Break
            Candidate's Last Answer: {last_answer}
            
            # INSTRUCTION
            {followup_instruction}
            
            # RULE
            - If the candidate says "break", just say "Sure, take your time." and wait.
            - If instruction says asking for break choice, ask EXACTLY: "Great job completing the technical rounds. Before we move to the HR round, would you like to take a short break or continue right away?"
            - If instruction says "The candidate is ready", say "Excellent. Let's begin the HR and Behavioral round." and then ask the first question: "Tell me about a significant challenge you faced in your work."
            """
            return await self.llm_client.generate_completion(prompt, "You are a helpful interviewer.")
            
        if stage == "hr_round":
            prompt_template = HR_INTERVIEWER_PROMPT
            hr_step = kwargs.get('item_step', 1) # Will be calculated by orchestrator
            
            prompt = f"""
            # CONTEXT
            Current Stage: HR & Behavioral Round
            Question Number: {hr_step}
            Resume Context: {resume_context[:3000]}
            
            # CONVERSATION STATE
            Previous History:
            {conversation_history}
            
            Candidate's Last Answer: {last_answer}
            
            # INSTRUCTION FOR THIS TURN
            {followup_instruction}
            
            # EXECUTION
            Based on the above, ask the next HR question. Be professional and encouraging.
            """
            
            return await self.llm_client.generate_completion(prompt, prompt_template)
            
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
