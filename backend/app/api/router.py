from fastapi import APIRouter

from app.api.routes import health, summarize, quiz, audio

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(summarize.router)
api_router.include_router(quiz.router)
api_router.include_router(audio.router)
