from pydantic import BaseModel, field_validator
from typing import Optional, List


class Event(BaseModel):
    title: str

    @field_validator("title", mode="before")
    @classmethod
    def capitalize_title(cls, v: str) -> str:
        return v.strip().title() if isinstance(v, str) else v
    description: Optional[str] = None
    date: str                    # "YYYY-MM-DD"
    start_time: Optional[str] = None   # "HH:MM" or None
    end_time: Optional[str] = None
    all_day: bool = False
    location: Optional[str] = None
    reminder_minutes_before: Optional[int] = None
    time_unspecified: bool = False


class ParseRequest(BaseModel):
    text: str


class ParseResponse(BaseModel):
    events: List[Event]
