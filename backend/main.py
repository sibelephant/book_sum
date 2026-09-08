import logging
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel

from app.services import ai, text_extraction

load_dotenv()

logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title='Summara API',
    description='AI book summarization backend: parse, summarize, quiz, and TTS.',
    version='0.1.0',
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=False,
    allow_methods=['*'],
    allow_headers=['*'],
)


class SummarizeTextRequest(BaseModel):
    text: str
    length: str = 'medium'
    style: str = 'simple'


class QuizRequest(BaseModel):
    text: str
    num_questions: int = 5


class TTSRequest(BaseModel):
    text: str
    voice: str = 'alloy'


@app.get('/health')
def health():
    return {'status': 'ok', 'service': 'summara-api'}


@app.post('/summarize/text')
async def summarize_text(req: SummarizeTextRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail='Text cannot be empty.')
    try:
        summary = ai.summarize_text(req.text, req.length, req.style)
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001
        logging.exception('Summarization failed')
        raise HTTPException(
            status_code=502,
            detail='AI summarization failed. Check your OpenAI API key.',
        ) from exc
    return {'summary': summary}


@app.post('/summarize/file')
async def summarize_file(
    file: UploadFile = File(...),
    length: str = Form('medium'),
    style: str = Form('simple'),
):
    data = await file.read()
    try:
        try:
            text = text_extraction.extract_text(file.filename or '', data)
            summary = ai.summarize_text(text, length, style)
        except text_extraction.ImageParsed as img:
            summary = ai.summarize_image(img.data, img.filename, length, style)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        logging.exception('File summarization failed')
        raise HTTPException(
            status_code=502,
            detail='AI summarization failed. Check your OpenAI API key.',
        ) from exc
    return {'summary': summary}


@app.post('/quiz')
async def quiz(req: QuizRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail='Text cannot be empty.')
    try:
        result = ai.create_quiz(req.text, max(1, min(10, req.num_questions)))
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001
        logging.exception('Quiz generation failed')
        raise HTTPException(status_code=502, detail='Quiz generation failed.') from exc
    return result


@app.post('/tts')
async def tts(req: TTSRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail='Text cannot be empty.')
    try:
        audio = ai.synthesize_speech(req.text, req.voice)
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001
        logging.exception('TTS failed')
        raise HTTPException(status_code=502, detail='Audio generation failed.') from exc
    return Response(
        content=audio,
        media_type='audio/mpeg',
        headers={'Content-Disposition': 'attachment; filename="summary.mp3"'},
    )
