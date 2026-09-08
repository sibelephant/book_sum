import io
import logging

from pypdf import PdfReader
from docx import Document

logger = logging.getLogger(__name__)

MAX_CHARS = 120_000


def extract_text(filename: str, data: bytes) -> str:
    """Extract plain text from an uploaded file based on its extension."""
    name = (filename or '').lower()
    if name.endswith('.pdf'):
        return _from_pdf(data)
    if name.endswith('.docx'):
        return _from_docx(data)
    if name.endswith('.txt') or name.endswith('.md'):
        return data.decode('utf-8', errors='ignore')
    if name.endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp')):
        return _from_image(data, filename)
    raise ValueError(
        'Unsupported file type. Upload a PDF, DOCX, TXT, or image.'
    )


def _from_pdf(data: bytes) -> str:
    reader = PdfReader(io.BytesIO(data))
    pages = []
    for page in reader.pages:
        try:
            pages.append(page.extract_text() or '')
        except Exception as exc:  # noqa: BLE001
            logger.warning('Failed to extract a PDF page: %s', exc)
    text = '\n'.join(pages).strip()
    if not text:
        raise ValueError(
            'Could not extract text from this PDF. It may be a scanned image '
            'with no selectable text.'
        )
    return text[:MAX_CHARS]


def _from_docx(data: bytes) -> str:
    doc = Document(io.BytesIO(data))
    paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
    # Include table content where relevant
    for table in doc.tables:
        for row in table.rows:
            cells = [c.text.strip() for c in row.cells if c.text.strip()]
            if cells:
                paragraphs.append(' | '.join(cells))
    text = '\n'.join(paragraphs).strip()
    if not text:
        raise ValueError('This DOCX file appears to contain no readable text.')
    return text[:MAX_CHARS]


def _from_image(data: bytes, filename: str) -> str:
    """Return a placeholder marker so text extraction is handled upstream."""
    # The OpenAI vision model reads the raw image directly, so we return a
    # sentinel carrying the image bytes via a side channel.
    raise ImageParsed(data, filename)


class ImageParsed(Exception):
    """Carries the raw image bytes up to the summarization layer."""

    def __init__(self, data: bytes, filename: str) -> None:
        super().__init__('Image parsed')
        self.data = data
        self.filename = filename


def truncate(text: str, limit: int = MAX_CHARS) -> str:
    return text[:limit]
