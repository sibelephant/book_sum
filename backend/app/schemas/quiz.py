from typing import List
from pydantic import BaseModel, Field


class QuizQuestion(BaseModel):
    question: str
    options: List[str] = Field(default_factory=list)
    correctIndex: int = 0


class QuizRequest(BaseModel):
    text: str = Field(..., description="Text from which to generate quiz questions")
    num_questions: int = Field(5, ge=1, le=10, description="Number of questions (1-10)")


class QuizResponse(BaseModel):
    quiz: List[QuizQuestion]
