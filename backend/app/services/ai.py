import base64
import json
import logging
from typing import Any, Dict

from openai import AsyncOpenAI

from app.core.config import settings
from app.core.prompts import build_summary_prompt, QUIZ_PROMPT

logger = logging.getLogger(__name__)

_client: AsyncOpenAI | None = None


def _get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        _client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY or None)
    return _client


async def summarize_text(text: str, length: str = 'medium', style: str = 'simple') -> str:
    """Summarize extracted document or input text."""
    client = _get_client()
    response = await client.chat.completions.create(
        model=settings.DEFAULT_SUMMARY_MODEL,
        messages=[
            {
                'role': 'system',
                'content': 'You produce clear, accurate, well-structured summaries.',
            },
            {'role': 'user', 'content': build_summary_prompt(text, length, style)},
        ],
        temperature=0.4,
    )
    return response.choices[0].message.content.strip()


async def summarize_image(data: bytes, filename: str, length: str, style: str) -> str:
    """Summarize the visual content of an image using a vision model."""
    client = _get_client()
    b64 = base64.b64encode(data).decode('utf-8')
    mime = 'image/png'
    lower = (filename or '').lower()
    if lower.endswith(('.jpg', '.jpeg')):
        mime = 'image/jpeg'
    elif lower.endswith('.webp'):
        mime = 'image/webp'
    elif lower.endswith('.gif'):
        mime = 'image/gif'

    instruction = build_summary_prompt(
        'the content shown in this image (e.g. a book page or document).',
        length,
        style,
    )
    response = await client.chat.completions.create(
        model=settings.DEFAULT_VISION_MODEL,
        messages=[
            {
                'role': 'user',
                'content': [
                    {'type': 'text', 'text': instruction},
                    {'type': 'image_url', 'image_url': {'url': f'data:{mime};base64,{b64}'}},
                ],
            }
        ],
        temperature=0.4,
    )
    return response.choices[0].message.content.strip()


async def create_quiz(text: str, num_questions: int = 5) -> Dict[str, Any]:
    """Generate a multiple-choice quiz JSON based on the provided text."""
    client = _get_client()
    response = await client.chat.completions.create(
        model=settings.DEFAULT_SUMMARY_MODEL,
        messages=[{'role': 'user', 'content': QUIZ_PROMPT.format(text=text, n=num_questions)}],
        temperature=0.5,
        response_format={'type': 'json_object'},
    )
    raw = response.choices[0].message.content.strip()
    data = json.loads(raw)
    quiz = data.get('quiz', [])
    for q in quiz:
        q.setdefault('options', [])
        q.setdefault('correctIndex', 0)
    return {'quiz': quiz}


async def synthesize_speech(text: str, voice: str = 'alloy') -> bytes:
    """Generate spoken audio (TTS MP3) for the text, clamped to max safe characters."""
    client = _get_client()
    # Enforce OpenAI TTS character limit (4000 characters)
    safe_text = text[:settings.MAX_TTS_CHARS]
    response = await client.audio.speech.create(
        model=settings.DEFAULT_TTS_MODEL,
        voice=voice,
        input=safe_text,
    )
    return response.content
