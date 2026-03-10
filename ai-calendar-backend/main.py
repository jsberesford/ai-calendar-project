from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models import ParseRequest, ParseResponse
from ai_service import parse_text_to_events
from auth import router as auth_router
from calendar_service import router as calendar_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(calendar_router)

@app.get("/")
def root():
    return {"message": "AI Calendar API is running"}

@app.post("/parse-events", response_model=ParseResponse)
def parse_events(req: ParseRequest):
    events = parse_text_to_events(req.text)
    return {"events": events}
