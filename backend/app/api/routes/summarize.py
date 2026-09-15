import logging
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from anyio import to_thread

from app.core.config import settings
from app.schemas.summarize import SummarizeTextRequest, SummaryResponse
from app.services import ai, text_extraction

logger = logging.getLogger(__name__)

router = APIRouter(prefix='/summarize', tags=['Summarize'])


@router.post('/text', response_model=SummaryResponse)
async def summarize_text(req: SummarizeTextRequest):
    """Generate an AI summary from plain text."""
    if not req.text.strip():
        raise HTTPException(status_code=400, detail='Text cannot be empty.')
    try:
        summary = await ai.summarize_text(req.text, req.length, req.style)
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001
        logger.exception('Summarization failed')
        raise HTTPException(
            status_code=502,
            detail='AI summarization failed. Check your OpenAI API key.',
        ) from exc
    return SummaryResponse(summary=summary)


@router.post('/file', response_model=SummaryResponse)
async def summarize_file(
    file: UploadFile = File(..., description="Document file (PDF, DOCX, TXT, or Image)"),
    length: str = Form('medium', description="Summary length: 'short', 'medium', or 'detailed'"),
    style: str = Form('simple', description="Summary style: 'simple', 'academic', or 'bullets'"),
):
    """Extract content from an uploaded document or image and generate an AI summary."""
    data = await file.read()
    if len(data) > settings.MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f'File exceeds maximum size of {settings.MAX_UPLOAD_SIZE_BYTES // (1024 * 1024)}MB.',
        )

    try:
        try:
            # Run CPU-heavy file parsing in threadpool to keep event loop responsive
            text = await to_thread.run_sync(text_extraction.extract_text, file.filename or '', data)
            summary = await ai.summarize_text(text, length, style)
        except text_extraction.ImageParsed as img:
            summary = await ai.summarize_image(img.data, img.filename, length, style)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        logger.exception('File summarization failed')
        raise HTTPException(
            status_code=502,
            detail='AI summarization failed. Check your OpenAI API key.',
        ) from exc
    return SummaryResponse(summary=summary)
