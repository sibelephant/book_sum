#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -d "venv" ]; then
  echo "Creating virtual environment..."
  python3 -m venv venv
  ./venv/bin/pip install -r requirements.txt
fi

if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "Created .env from example. Add your OPENAI_API_KEY."
fi

exec ./venv/bin/uvicorn main:app --reload --host 0.0.0.0 --port "${PORT:-8000}"
