from ..services.llm_client import LLMClient
from ..utils.prompt_loader import RESUME_ANALYZER_PROMPT

class ResumeAnalyzerAgent:
    def __init__(self):
        self.llm_client = LLMClient()

    async def analyze(self, resume_text: str) -> dict:
        prompt = f"Here is the candidate's resume text:\n\n{resume_text}"
        response = await self.llm_client.generate_json(prompt, RESUME_ANALYZER_PROMPT)
        
        default_structure = {
            "skills": [],
            "projects": [],
            "experience": [],
            "achievements": [],
            "education": [],
            "strengths": [],
            "weaknesses": [],
            "interview_plan": {
                "intro": [],
                "projects": [],
                "technical": [],
                "hr": []
            }
        }

        if "error" in response:
            return default_structure
        
        # Merge with default to ensure all keys exist
        for key in default_structure:
            if key not in response:
                response[key] = default_structure[key]
            elif isinstance(default_structure[key], dict) and isinstance(response[key], dict):
                for subkey in default_structure[key]:
                    if subkey not in response[key]:
                        response[key][subkey] = default_structure[key][subkey]
                        
        return response
