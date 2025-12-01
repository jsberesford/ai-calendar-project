import os
import json

import google.generativeai as genai
from dotenv import load_dotenv

from models import Event

# Load .env and configure Gemini
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Use a widely-supported model
model = genai.GenerativeModel("gemini-pro")

SYSTEM_PROMPT = """
You are an event parser. Convert natural language into structured calendar events.
Return ONLY valid JSON that matches this structure exactly:

[
  {
    "title": "string",
    "date": "YYYY-MM-DD",
    "start_time": "HH:MM or null",
    "end_time": "HH:MM or null",
    "all_day": true/false,
    "location": "string or null",
    "description": "string or null",
    "reminder_minutes_before": number or null,
    "time_unspecified": true/false
  }
]

No extra keys. No extra text. No explanations.
"""


def parse_text_to_events(text: str):
    prompt = SYSTEM_PROMPT + "\n\nUser Input:\n" + text

    response = model.generate_content(
        prompt,
        generation_config={"response_mime_type": "application/json"}
    )

    events_raw = response.text

    try:
        events_json = json.loads(events_raw)
    except Exception as e:
        # Debug logging if the model returns invalid JSON
        print("JSON parse error from Gemini:", e)
        print("Raw model text:", events_raw)
        return []

    events = []
    for e in events_json:
        events.append(Event(**e))
    return events
