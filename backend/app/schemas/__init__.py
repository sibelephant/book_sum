"""Pydantic schemas for request validation and response models."""
from app.schemas.summarize import SummarizeTextRequest, SummaryResponse
from app.schemas.quiz import QuizRequest, QuizResponse, QuizQuestion
from app.schemas.audio import TTSRequest

__all__ = [
    'SummarizeTextRequest',
    'SummaryResponse',
    'QuizRequest',
    'QuizResponse',
    'QuizQuestion',
    'TTSRequest',
]
