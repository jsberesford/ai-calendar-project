#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

# Use project venv if it exists
if [ -f "$PROJECT_ROOT/venv/bin/python" ]; then
  PYTHON="$PROJECT_ROOT/venv/bin/python"
elif [ -f "$SCRIPT_DIR/venv/bin/python" ]; then
  PYTHON="$SCRIPT_DIR/venv/bin/python"
else
  PYTHON="python3"
fi

exec "$PYTHON" -m uvicorn main:app \
  --reload \
  --reload-dir ai-calendar-backend \
  --app-dir ai-calendar-backend \
  --env-file ai-calendar-backend/.env
