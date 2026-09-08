# Summara — AI Book Summarization Web Application

Final-year project: upload a book/document, generate an AI summary, create a quiz,
listen to the summary as audio, save and download previous summaries.

## Stack

- **Frontend** — React 19 (Create React App) + React Router + Supabase JS client
- **Backend** — FastAPI (parse files, OpenAI summary/quiz, OpenAI TTS)
- **Auth & storage** — Supabase (users, saved summaries, quizzes)

## Project layout

```
book_sum/
├── product-design.md      # Design brief (screens, components, style guide)
├── frontend/              # React app
│   ├── src/
│   │   ├── pages/         # Landing, auth, dashboard, new, result, quiz, summaries, profile, settings
│   │   ├── components/    # layout (Navbar/Sidebar/TopBar) + ui (Button, Card, Modal, Toast…)
│   │   ├── lib/           # supabaseClient, api (FastAPI calls)
│   │   ├── context/       # Toast provider
│   │   └── hooks/         # useUser (Supabase session)
│   └── .env.example
└── backend/               # FastAPI service
    ├── app/services/      # text_extraction (PDF/DOCX/TXT/image), ai (OpenAI)
    ├── main.py            # API routes
    └── requirements.txt
```

## Getting started

### 1. Backend (FastAPI)

```bash
cd backend
cp .env.example .env          # add OPENAI_API_KEY
./run.sh                      # creates venv + installs deps + starts on :8000
```

Endpoints:
- `GET /health`
- `POST /summarize/text` — `{ text, length, style }` → `{ summary }`
- `POST /summarize/file` — multipart `file` + `length` + `style` → `{ summary }`
- `POST /quiz` — `{ text, num_questions }` → `{ quiz: [...] }`
- `POST /tts` — `{ text, voice }` → `audio/mpeg`

`length`: `short | medium | detailed` · `style`: `simple | academic | bullets`

### 2. Frontend (React)

```bash
cd frontend
cp .env.example .env          # add Supabase URL + anon key, API base URL
npm install
npm start                     # dev server on :3000
```

`npm run build` produces an optimized production build in `frontend/build`.

## Supabase setup

Create a Supabase project and add a `summaries` table:

```sql
create table if not exists public.summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text,
  content text not null,
  length text,
  style text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

Enable row-level security (users only see their own rows):

```sql
alter table public.summaries enable row level security;
create policy "own rows" on public.summaries
  for all using (auth.uid() = user_id);
```

Also add a `quizzes` table for quiz results if you want them persisted.
