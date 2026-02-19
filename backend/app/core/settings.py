
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    APP_NAME: str = "AI Interview Buddy"
    GITHUB_MODELS_BASE_URL: str = "https://models.inference.ai.azure.com"
    GITHUB_MODELS_API_KEY: str
    DATABASE_URL: str = "sqlite:///./data/ai_interview_buddy.db"
    
    # STT/TTS Providers
    STT_PROVIDER: str = "google" # or "azure"
    TTS_PROVIDER: str = "google" # or "azure"
    
    # Model
    MODEL_NAME: str = "gpt-4o"

    @property
    def api_keys_list(self) -> list[str]:
        """Returns a list of keys split by comma from the env string"""
        return [k.strip() for k in self.GITHUB_MODELS_API_KEY.split(",") if k.strip()]

    class Config:
        env_file = ".env"

settings = Settings()
