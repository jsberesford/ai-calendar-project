"""
Google OAuth 2.0 authentication for Flowdate.
"""
import os
import secrets
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from dotenv import load_dotenv

load_dotenv()

# In-memory session store: session_id -> user info + tokens
# Use Redis/DB in production
sessions: dict[str, dict] = {}

# PKCE: store Flow by state so code_verifier persists across redirect
flow_storage: dict[str, Flow] = {}

router = APIRouter(prefix="/auth", tags=["auth"])

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
BACKEND_URL = os.getenv("BACKEND_URL", "http://127.0.0.1:8000")


def get_flow():
    """Build OAuth flow with redirect to our callback."""
    return Flow.from_client_config(
        {
            "web": {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": [f"{BACKEND_URL}/auth/callback"],
            }
        },
        scopes=[
            "openid",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/calendar",  # For later: add to calendar
        ],
        redirect_uri=f"{BACKEND_URL}/auth/callback",
    )


def get_user_info(credentials: Credentials) -> dict:
    """Fetch user profile from Google."""
    import httpx

    resp = httpx.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        headers={"Authorization": f"Bearer {credentials.token}"},
    )
    resp.raise_for_status()
    return resp.json()


@router.get("/debug")
def auth_debug():
    """Check which redirect URI the app is using (for troubleshooting redirect_uri_mismatch)."""
    return {
        "BACKEND_URL": BACKEND_URL,
        "redirect_uri": f"{BACKEND_URL}/auth/callback",
        "hint": "Add this exact redirect_uri to Google Cloud Console > Credentials > OAuth 2.0 Client > Authorized redirect URIs",
    }


@router.get("/google")
def auth_google():
    """Start Google OAuth flow."""
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=500,
            detail="Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.",
        )
    flow = get_flow()
    authorization_url, state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent",
    )
    flow_storage[state] = flow
    return RedirectResponse(authorization_url)


@router.get("/callback")
def auth_callback(code: str | None = None, state: str | None = None, error: str | None = None):
    """Handle OAuth callback from Google."""
    if error:
        return RedirectResponse(f"{FRONTEND_URL}?auth_error={error}")
    if not code:
        return RedirectResponse(f"{FRONTEND_URL}?auth_error=no_code")
    if not state or state not in flow_storage:
        return RedirectResponse(f"{FRONTEND_URL}?auth_error=invalid_state")

    flow = flow_storage.pop(state)
    flow.fetch_token(code=code)

    credentials = flow.credentials
    user_info = get_user_info(credentials)

    session_id = secrets.token_urlsafe(32)
    sessions[session_id] = {
        "email": user_info.get("email"),
        "name": user_info.get("name"),
        "picture": user_info.get("picture"),
        "credentials": {
            "token": credentials.token,
            "refresh_token": credentials.refresh_token,
            "token_uri": credentials.token_uri,
            "client_id": credentials.client_id,
            "client_secret": credentials.client_secret,
            "scopes": list(credentials.scopes) if credentials.scopes else [],
        },
    }

    response = RedirectResponse(url=f"{FRONTEND_URL}")
    response.set_cookie(
        key="flowdate_session",
        value=session_id,
        httponly=True,
        samesite="lax",
        max_age=60 * 60 * 24 * 7,  # 7 days
    )
    return response


def get_current_session(session_id: str | None) -> dict | None:
    """Return session data if valid."""
    if not session_id:
        return None
    return sessions.get(session_id)


@router.get("/me")
def auth_me(request: Request):
    """Return current user if logged in."""
    session_id = request.cookies.get("flowdate_session")
    session = get_current_session(session_id)
    if not session:
        return {"logged_in": False, "user": None}
    return {
        "logged_in": True,
        "user": {
            "email": session.get("email"),
            "name": session.get("name"),
            "picture": session.get("picture"),
        },
    }


@router.get("/logout")
def auth_logout():
    """Clear session and redirect to frontend."""
    res = RedirectResponse(url=FRONTEND_URL)
    res.delete_cookie("flowdate_session")
    return res
