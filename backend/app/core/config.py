import os
from typing import List
from dotenv import load_dotenv

load_dotenv()


class Settings:
    PROJECT_NAME: str = 'Summara API'
    PROJECT_DESCRIPTION: str = 'AI book summarization backend: parse, summarize, quiz, and TTS.'
    VERSION: str = '0.2.0'

    # OpenAI
    OPENAI_API_KEY: str = os.getenv('OPENAI_API_KEY', '')
    DEFAULT_SUMMARY_MODEL: str = 'gpt-4o-mini'
    DEFAULT_VISION_MODEL: str = 'gpt-4o-mini'
    DEFAULT_TTS_MODEL: str = 'tts-1'

    # Security & CORS
    CORS_ORIGINS: List[str] = ['*']

    # Uploads & Limits
    MAX_TEXT_CHARS: int = 120_000
    MAX_TTS_CHARS: int = 4_000
    MAX_UPLOAD_SIZE_BYTES: int = 25 * 1024 * 1024  # 25 MB


settings = Settings()
