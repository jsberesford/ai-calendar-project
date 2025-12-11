import os
import json
import re

import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted
from fastapi import HTTPException
from dotenv import load_dotenv

from models import Event

# Load .env and configure Gemini
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Use a widely-supported model
model = genai.GenerativeModel("gemini-2.0-flash")

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
    try:
        # Combine system prompt with user input
        prompt = f"{SYSTEM_PROMPT}\n\nInput: {text}"
        print(f"Sending prompt to Gemini: {prompt[:100]}...") # Log prompt start
        response = model.generate_content(prompt)
        
        # Get the text content
        response_text = response.text
        print(f"Raw response from Gemini: {response_text}") # Log raw response
        
        # Clean up markdown code blocks if present
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].strip()
            
        # Parse JSON
        events_data = json.loads(response_text)
        
        # Convert to Event objects
        events = [Event(**event) for event in events_data]
        print(f"Parsed events: {events}") # Log parsed events
        return events

    except ResourceExhausted as e:
        print("Gemini/Vertex quota hit:", e)
        raise HTTPException(
            status_code=429,
            detail="AI quota / rate limit hit. Try again in a bit or reduce request frequency."
        )
    except Exception as e:
        print(f"Error parsing events: {e}")
        # Return empty list or raise error depending on preference. 
        # For now, let's return empty list but log the error so the backend stays alive
        return []
