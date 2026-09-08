import base64
import json
import logging

from openai import OpenAI

logger = logging.getLogger(__name__)

client = None

LENGTH_PROMPTS = {
    'short': 'a concise summary in 3-5 short paragraphs.',
    'medium': 'a balanced summary in 5-8 paragraphs.',
    'detailed': 'a thorough, detailed summary in 10-14 paragraphs.',
}

STYLE_PROMPTS = {
    'simple': 'Use simple, plain language that anyone can understand.',
    'academic': 'Use a formal, scholarly tone with precise terminology.',
    'bullets': 'Present the summary as a clear list of bullet points.',
}


def _get_client() -> OpenAI:
    global client
    if client is None:
        client = OpenAI()
    return client


def build_summary_prompt(text: str, length: str, style: str) -> str:
    length_desc = LENGTH_PROMPTS.get(length, LENGTH_PROMPTS['medium'])
    style_desc = STYLE_PROMPTS.get(style, STYLE_PROMPTS['simple'])
    return (
        f'You are an expert summarizer. Summarize the following document. '
        f'Produce {length_desc} {style_desc} '
        f'Focus on the main ideas, key arguments, and important takeaways. '
        f'Do not add information that is not in the document.\n\n'
        f'--- DOCUMENT START ---\n{text}\n--- DOCUMENT END ---'
    )


def summarize_text(text: str, length: str = 'medium', style: str = 'simple') -> str:
    response = _get_client().chat.completions.create(
        model='gpt-4o-mini',
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


def summarize_image(data: bytes, filename: str, length: str, style: str) -> str:
    """Summarize the visual content of an image using a vision model."""
    b64 = base64.b64encode(data).decode('utf-8')
    mime = 'image/png'
    lower = (filename or '').lower()
    if lower.endswith('.jpg') or lower.endswith('.jpeg'):
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
    response = _get_client().chat.completions.create(
        model='gpt-4o-mini',
        messages=[
            {
                'role': 'user',
                'content': [
                    {
                        'type': 'text',
                        'text': instruction,
                    },
                    {
                        'type': 'image_url',
                        'image_url': {
                            'url': f'data:{mime};base64,{b64}',
                        },
                    },
                ],
            }
        ],
        temperature=0.4,
    )
    return response.choices[0].message.content.strip()


QUIZ_PROMPT = """
You are a quiz generator. Based on the provided text, create a multiple-choice quiz.
Return ONLY valid JSON with the following shape (no markdown, no explanation):
{
  "quiz": [
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0
    }
  ]
}
The "correctIndex" is the 0-based index of the correct answer in "options".
Generate exactly {n} questions.
--- TEXT START ---
{text}
--- TEXT END ---
"""


def create_quiz(text: str, num_questions: int = 5) -> dict:
    response = _get_client().chat.completions.create(
        model='gpt-4o-mini',
        messages=[{'role': 'user', 'content': QUIZ_PROMPT.format(text=text, n=num_questions)}],
        temperature=0.5,
        response_format={'type': 'json_object'},
    )
    raw = response.choices[0].message.content.strip()
    data = json.loads(raw)
    quiz = data.get('quiz', [])
    # Sanitize
    for q in quiz:
        q.setdefault('options', [])
        q.setdefault('correctIndex', 0)
    return {'quiz': quiz}


def synthesize_speech(text: str, voice: str = 'alloy') -> bytes:
    response = _get_client().audio.speech.create(
        model='tts-1',
        voice=voice,
        input=text,
    )
    return response.content
