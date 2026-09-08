# Summara — Project Overview & User Flow

> AI Book Summarization Web Application — final-year project.

## What it is

A web app that turns any book or long document into a clear, AI-generated summary.
From that summary you can: generate a quiz, listen to it as audio, save it for
later, and download it.

## Architecture

```
┌─────────────────────────┐         ┌──────────────────────────┐
│  React Frontend (CRA)   │  JSON / │  FastAPI Backend         │
│  - React Router SPA     │ FormData │  - text extraction       │
│  - Supabase JS client   ├────────►│    (PDF/DOCX/TXT/image)  │
│  - design system CSS    │   HTTP  │  - OpenAI summary/quiz   │
└───────────┬─────────────┘         │  - OpenAI TTS (audio)    │
            │                       └────────────┬─────────────┘
            │             Supabase              │      OpenAI
            │      auth + Postgres storage      ▼      (GPT-4o-mini, tts-1)
            └─────────────────►  users               ┌─────────────────┐
                                 summaries           │   ai.py         │
                                 quizzes             └─────────────────┘
```

- **Auth & storage:** Supabase (users, saved summaries, quiz results)
- **AI/processing:** FastAPI + OpenAI (summarize, quiz JSON, text-to-speech)

---

## End-to-end user flow

```
Landing  ─►  Register / Login  ─►  Dashboard  ─►  New Summary
                                                      │
                                    Upload file or paste text
                                                      │
                                    Pick length (short/medium/detailed)
                                      & style (simple/academic/bullets)
                                                      │
                                                      ▼
                                    Generate Summary ──► FastAPI ─► OpenAI
                                                      │
                                                      ▼
                                            ┌──► Quiz (MCQ + score)
                                            │      │
                                  Result ────┤──► Listen (TTS audio)
                                            │      │
                                            ├──► Download (.md)
                                            │      │
                                            └──► Save ─► My Summaries
                                                              │
                                                search + filter + reopen + delete
```

### Step-by-step walk-through

1. **Landing** (`pages/Landing.jsx`) — hero, features, CTA. Navbar links to Login / Get Started.

2. **Register / Login** (`Register.jsx`, `Login.jsx`) — call `supabase.auth.signUp()` /
   `signInWithPassword()`. The session drives everything behind `ProtectedRoute`
   (`components/auth/ProtectedRoute.jsx`), which redirects to `/login` when logged out.

3. **Dashboard** (`pages/Dashboard.jsx`) — stat cards (Total Summaries, Quizzes,
   Uploads) + recent summaries, fetched from Supabase's `summaries` table for the
   signed-in user. Quick action button → New Summary.

4. **New Summary** (`pages/NewSummary.jsx`) — the core screen:
   - **Upload** via drag-and-drop `UploadCard` (PDF / DOCX / TXT / image)
   - **or Paste text** (with optional title + char count)
   - Select **length** and **style**, then **Generate Summary**.

5. **Backend processing** (`backend/main.py` + `app/services/`):
   - `POST /summarize/text` — summarize pasted text directly.
   - `POST /summarize/file` — `text_extraction.py` parses:
     - PDF → `pypdf`
     - DOCX → `python-docx`
     - Image → OpenAI vision
   - `ai.py` builds a prompt from the length/style → `gpt-4o-mini` returns the summary.

6. **Result** (`pages/SummaryResult.jsx`) — clean reading panel with actions:
   - **Generate Quiz** → `POST /quiz` → MCQ JSON `{question, options, correctIndex}`
   - **Listen** → `POST /tts` → OpenAI TTS MP3, inline audio player
   - **Download** → client-side `.md` file
   - **Save** → inserts row into Supabase `summaries`

7. **Quiz** (`pages/Quiz.jsx`) — one MCQ at a time, progress segments, next/prev,
   submit → score ring + percentage, correct/wrong highlighting, retry. Score saved
   to Supabase `quizzes`.

8. **My Summaries** (`pages/MySummaries.jsx`) — search + filters (length/style),
   cards with Open / Download / Delete (confirmation dialog).

9. **Profile / Settings** (`Profile.jsx`, `Settings.jsx`) — edit name, change
   password, delete account, logout; TTS engine / default length / notifications.

---

## Backend API

| Method | Endpoint           | Body                                        | Response              |
|--------|--------------------|---------------------------------------------|-----------------------|
| GET    | `/health`          | —                                           | `{ status: 'ok' }`    |
| POST   | `/summarize/text`  | `{ text, length, style }`                   | `{ summary }`         |
| POST   | `/summarize/file`  | multipart `file` + `length` + `style`       | `{ summary }`         |
| POST   | `/quiz`            | `{ text, num_questions }`                   | `{ quiz: [...] }`     |
| POST   | `/tts`             | `{ text, voice }`                           | `audio/mpeg` file     |

Values: `length` = `short | medium | detailed` · `style` = `simple | academic | bullets`

## Project layout

```
book_sum/
├── product-design.md      # design brief (screens, components, style guide)
├── README.md              # setup instructions
├── frontend/
│   ├── src/
│   │   ├── pages/         # 12 pages (5 public, 7 protected)
│   │   ├── components/
│   │   │   ├── layout/    # Navbar, Sidebar (Logo), TopBar, ProtectedRoute
│   │   │   └── ui/        # Button, Input, Modal, Toast, Cards, Spinner, …
│   │   ├── lib/           # supabaseClient, api (FastAPI client)
│   │   ├── hooks/         # useUser
│   │   └── context/       # ToastProvider
│   └── .env.example
└── backend/
    ├── main.py            # FastAPI routes + CORS
    ├── app/services/
    │   ├── text_extraction.py  # PDF/DOCX/TXT/image parsing
    │   └── ai.py               # OpenAI summary, quiz, TTS
    ├── requirements.txt
    └── run.sh
```

## Pages (frontend)

| # | Page                 | Auth    | Route           | Purpose                                     |
|---|----------------------|---------|-----------------|---------------------------------------------|
| 1 | Landing              | public  | `/`             | Intro + features + CTA                      |
| 2 | Register             | public  | `/register`     | Create account                              |
| 3 | Login                | public  | `/login`        | Sign in                                     |
| 4 | ForgotPassword       | public  | `/forgot-password` | Email reset link                        |
| 5 | ResetPassword        | public  | `/reset-password`  | Set new password                        |
| 6 | Dashboard            | private | `/dashboard`    | Stats + recent summaries                    |
| 7 | NewSummary           | private | `/new`          | Upload/paste + generate                     |
| 8 | SummaryResult        | private | `/result`       | Reading panel + actions                     |
| 9 | Quiz                 | private | `/quiz`         | MCQ + results                               |
|10 | MySummaries          | private | `/summaries`    | Search/filter/manage saved summaries        |
|11 | Profile              | private | `/profile`      | Account details, security, delete           |
|12 | Settings             | private | `/settings`     | Preferences                                 |

## Example use case

> A student has a 300-page textbook. They register, open **New Summary**, upload the PDF,
> choose **Medium + Bullet Points**, and hit Generate. FastAPI extracts the text, GPT-4o-mini
> returns a scannable bullet summary. They save it, generate a 5-question quiz, score 80%,
> then listen to the summary while commuting. Back on My Summaries they can reopen, download,
> or delete it anytime.