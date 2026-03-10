"""
Google Calendar integration — creates events using stored OAuth credentials.
"""
from fastapi import APIRouter, HTTPException, Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

from auth import get_current_session
from models import Event

router = APIRouter(prefix="/calendar", tags=["calendar"])


def _build_service(creds_data: dict):
    """Reconstruct Credentials and build the Calendar API client."""
    credentials = Credentials(
        token=creds_data["token"],
        refresh_token=creds_data.get("refresh_token"),
        token_uri=creds_data["token_uri"],
        client_id=creds_data["client_id"],
        client_secret=creds_data["client_secret"],
        scopes=creds_data.get("scopes"),
    )
    return build("calendar", "v3", credentials=credentials)


def _event_to_gcal(event: Event, timezone: str = "UTC") -> dict:
    """Convert our Event model to a Google Calendar event body. Uses user's timezone so times display correctly."""
    if event.all_day or event.time_unspecified or not event.start_time:
        gcal_event = {
            "summary": event.title,
            "start": {"date": event.date},
            "end": {"date": event.date},
        }
    else:
        start_dt = f"{event.date}T{event.start_time}:00"
        end_dt = f"{event.date}T{event.end_time}:00" if event.end_time else start_dt
        gcal_event = {
            "summary": event.title,
            "start": {"dateTime": start_dt, "timeZone": timezone},
            "end": {"dateTime": end_dt, "timeZone": timezone},
        }

    if event.location:
        gcal_event["location"] = event.location
    if event.description:
        gcal_event["description"] = event.description
    if event.reminder_minutes_before is not None:
        gcal_event["reminders"] = {
            "useDefault": False,
            "overrides": [{"method": "popup", "minutes": event.reminder_minutes_before}],
        }

    return gcal_event


@router.post("/add-events")
async def add_events_to_calendar(request: Request):
    """Add parsed events to the user's primary Google Calendar. Send {events: [...], timezone?: "America/New_York"}."""
    body = await request.json()
    events_data = body["events"] if isinstance(body, dict) else body
    timezone = (body.get("timezone") or "UTC") if isinstance(body, dict) else "UTC"
    events = [Event(**e) for e in events_data]

    session_id = request.cookies.get("flowdate_session")
    session = get_current_session(session_id)

    if not session:
        raise HTTPException(status_code=401, detail="Not logged in.")

    creds_data = session.get("credentials")
    if not creds_data:
        raise HTTPException(status_code=401, detail="No credentials in session.")

    service = _build_service(creds_data)

    created = []
    for event in events:
        gcal_body = _event_to_gcal(event, timezone=timezone)
        result = service.events().insert(calendarId="primary", body=gcal_body).execute()
        created.append({"title": event.title, "gcal_id": result.get("id"), "link": result.get("htmlLink")})

    return {"added": len(created), "events": created}
