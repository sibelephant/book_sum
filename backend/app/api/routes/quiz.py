import logging
from fastapi import APIRouter, HTTPException

from app.schemas.quiz import QuizRequest, QuizResponse
from app.services import ai

logger = logging.getLogger(__name__)

router = APIRouter(tags=['Quiz'])


@router.post('/quiz', response_model=QuizResponse)
async def generate_quiz(req: QuizRequest):
    """Generate a multiple-choice quiz based on the provided text."""
    if not req.text.strip():
        raise HTTPException(status_code=400, detail='Text cannot be empty.')
    try:
        result = await ai.create_quiz(req.text, max(1, min(10, req.num_questions)))
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001
        logger.exception('Quiz generation failed')
        raise HTTPException(status_code=502, detail='Quiz generation failed.') from exc
    return result
