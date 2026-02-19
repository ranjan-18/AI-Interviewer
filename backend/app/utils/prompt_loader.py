
import os

def load_prompt(filename: str) -> str:
    # Get the directory of the current file
    current_dir = os.path.dirname(os.path.abspath(__file__))
    # Go up one level to app/ and then into prompts/
    prompts_dir = os.path.join(os.path.dirname(current_dir), "prompts")
    file_path = os.path.join(prompts_dir, filename)
    
    if not os.path.exists(file_path):
        return ""
        
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()

# Pre-load prompts or export functions to get them
ORCHESTRATOR_PROMPT = load_prompt("orchestrator.txt")
RESUME_ANALYZER_PROMPT = load_prompt("resume_analyzer.txt")
INTERVIEWER_PROMPT = load_prompt("interviewer.txt")
FOLLOWUP_PROMPT = load_prompt("followup.txt")
TECHNICAL_EVALUATOR_PROMPT = load_prompt("technical_evaluator.txt")
HR_EVALUATOR_PROMPT = load_prompt("hr_evaluator.txt")
FEEDBACK_COACH_PROMPT = load_prompt("feedback_coach.txt")
HR_INTERVIEWER_PROMPT = load_prompt("hr_interviewer.txt")
