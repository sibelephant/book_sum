import logging
from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

from app.schemas.audio import TTSRequest
from app.services import ai

logger = logging.getLogger(__name__)

router = APIRouter(tags=['Audio'])


@router.post('/tts')
async def synthesize_audio(req: TTSRequest):
    """Convert text into speech (MP3 audio stream)."""
    if not req.text.strip():
        raise HTTPException(status_code=400, detail='Text cannot be empty.')
    try:
        audio = await ai.synthesize_speech(req.text, req.voice)
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001
        logger.exception('TTS failed')
        raise HTTPException(status_code=502, detail='Audio generation failed.') from exc
    return Response(
        content=audio,
        media_type='audio/mpeg',
        headers={'Content-Disposition': 'attachment; filename="summary.mp3"'},
    )
