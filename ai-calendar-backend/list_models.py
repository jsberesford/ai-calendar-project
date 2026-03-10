import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("No API key found")
    exit(1)

client = genai.Client(api_key=api_key)

print("Listing models...")
try:
    for m in client.models.list():
        if hasattr(m, "supported_actions") and m.supported_actions and "generateContent" in m.supported_actions:
            print(m.name)
        elif hasattr(m, "name"):
            print(m.name)
except Exception as e:
    print(f"Error: {e}")
