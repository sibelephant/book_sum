const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    const text = await res.text();
    let message = `Request failed (${res.status})`;
    try {
      const data = JSON.parse(text);
      if (data.detail) message = data.detail;
    } catch (_) {
      if (text) message = text;
    }
    throw new Error(message);
  }
  return res;
}

/**
 * Parse an uploaded file and generate an AI summary.
 * @param {File} file
 * @param {{length: string, style: string}} options
 */
export async function summarizeFile(file, options) {
  const form = new FormData();
  form.append('file', file);
  form.append('length', options.length);
  form.append('style', options.style);
  const res = await request('/summarize/file', { method: 'POST', body: form });
  return res.json();
}

/**
 * Generate a summary from pasted text.
 */
export async function summarizeText(text, options) {
  const res = await request('/summarize/text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, ...options }),
  });
  return res.json();
}

/**
 * Generate a quiz from a summary/doc text.
 */
export async function generateQuiz(text, numQuestions = 5) {
  const res = await request('/quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, num_questions: numQuestions }),
  });
  return res.json();
}

/**
 * Fetch an audio file (OpenAI TTS) as a Blob for playback/download.
 */
export async function generateAudio(text, options = {}) {
  const res = await request('/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, ...options }),
  });
  return res.blob();
}
