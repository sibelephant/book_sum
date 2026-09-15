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


QUIZ_PROMPT = """
You are a quiz generator. Based on the provided text, create a multiple-choice quiz.
Return ONLY valid JSON with the following shape (no markdown, no explanation):
{{
  "quiz": [
    {{
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0
    }}
  ]
}}
The "correctIndex" is the 0-based index of the correct answer in "options".
Generate exactly {n} questions.
--- TEXT START ---
{text}
--- TEXT END ---
"""
