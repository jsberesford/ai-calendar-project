from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models import ParseRequest, ParseResponse
from ai_service import parse_text_to_events

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "AI Calendar API is running"}

@app.post("/parse-events", response_model=ParseResponse)
def parse_events(req: ParseRequest):
    events = parse_text_to_events(req.text)
    return {"events": events}
