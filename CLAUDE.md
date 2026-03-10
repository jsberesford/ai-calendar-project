# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Flowdate OS** — an AI-powered calendar assistant that parses natural language text into structured calendar events. Two separate sub-projects:

- `ai-calendar-backend/` — Python FastAPI backend
- `ai-calendar-frontend/` — React + Vite + Tailwind frontend

## Backend

### Setup & Run

```bash
cd ai-calendar-backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at `http://127.0.0.1:8000`.

### Environment

Copy `.env.example` to `.env` and fill in:
- `GEMINI_API_KEY` — Google Gemini API key (used for NLP event parsing)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth credentials
- `FRONTEND_URL` / `BACKEND_URL` — optional URL overrides

### Architecture

- `main.py` — FastAPI app, CORS config, mounts auth router, exposes `POST /parse-events`
- `ai_service.py` — calls Gemini 2.0 Flash with a strict JSON-output system prompt; strips markdown fences from response; handles `ResourceExhausted` (429) gracefully
- `models.py` — Pydantic models: `Event`, `ParseRequest`, `ParseResponse`
- `auth.py` — Google OAuth 2.0 flow (`/auth/google` → `/auth/callback`); stores sessions in an in-memory dict (not persistent across restarts); sets `flowdate_session` cookie; exposes `/auth/me` and `/auth/logout`

**Key constraint:** Sessions are in-memory only — they're lost on server restart. The code notes this should use Redis/DB in production.

## Frontend

### Setup & Run

```bash
cd ai-calendar-frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

### Other Commands

```bash
npm run build    # production build
npm run lint     # ESLint
npm run preview  # preview production build
```

### Architecture

The entire frontend is a single file: `src/App.jsx`. It contains:
- Inline primitive components (`Badge`, `Card`, `Button`) — no external component library
- Auth state fetched from `/auth/me` on mount via cookie-based session
- `handleParse()` — POSTs natural language text to `/parse-events`, renders returned `Event[]`
- `API_BASE` hardcoded to `http://127.0.0.1:8000`

Styling: Tailwind CSS v4 (via `@tailwindcss/postcss`), dark theme with `#050505` background.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/parse-events` | Parse natural language → `Event[]` |
| GET | `/auth/google` | Start Google OAuth flow |
| GET | `/auth/callback` | OAuth callback |
| GET | `/auth/me` | Current session user |
| GET | `/auth/logout` | Clear session cookie |

## Event Schema

```json
{
  "title": "string",
  "date": "YYYY-MM-DD",
  "start_time": "HH:MM or null",
  "end_time": "HH:MM or null",
  "all_day": true/false,
  "location": "string or null",
  "description": "string or null",
  "reminder_minutes_before": "number or null",
  "time_unspecified": true/false
}
```
