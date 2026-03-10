import { useState, useEffect } from "react";

const API_BASE = "http://localhost:8000";

// --- Components ---

function Badge({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-wider text-white/60 ${className}`}>
      {children}
    </span>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl border border-white/10 bg-[#0F0F10] p-8 ${className}`}>
      {children}
    </div>
  );
}

function Button({ children, primary, onClick, disabled, href }) {
  const base =
    "inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-medium transition-colors active:scale-95 disabled:opacity-50";
  const primaryClass = "bg-white text-black font-semibold hover:opacity-90";
  const secondaryClass = "border border-white/10 bg-transparent text-white hover:bg-white/5";

  if (href) {
    return (
      <a
        href={href}
        className={`${base} ${primary ? primaryClass : secondaryClass}`}
      >
        {children}
      </a>
    );
  }
  if (primary) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-black transition-transform active:scale-95 disabled:opacity-50"
      >
        {children}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-transparent px-8 text-sm font-medium text-white transition-colors hover:bg-white/5 active:scale-95 disabled:opacity-50"
    >
      {children}
    </button>
  );
}

// --- Main App ---

export default function App() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [addingToCalendar, setAddingToCalendar] = useState(false);
  const [calendarResult, setCalendarResult] = useState(null);

  useEffect(() => {
    async function fetchAuth() {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
        const data = await res.json();
        if (data.logged_in && data.user) setUser(data.user);
      } catch (e) {
        console.error(e);
      } finally {
        setAuthLoading(false);
      }
    }
    fetchAuth();
    // Refetch after a short delay (handles redirect from OAuth where cookie arrives with the page)
    const t = setTimeout(fetchAuth, 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("auth_error");
    if (error) {
      console.warn("Auth error:", error);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  async function handleParse() {
    if (!input.trim()) return;
    setLoading(true);
    setCalendarResult(null);
    try {
      const res = await fetch(`${API_BASE}/parse-events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      setEvents(data.events || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToCalendar() {
    setAddingToCalendar(true);
    setCalendarResult(null);
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const res = await fetch(`${API_BASE}/calendar/add-events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ events, timezone }),
      });
      if (res.status === 401) {
        setCalendarResult({ error: "Sign in with Google first." });
        return;
      }
      const data = await res.json();
      setCalendarResult({ added: data.added, events: data.events });
    } catch (e) {
      console.error(e);
      setCalendarResult({ error: "Failed to add events. Try again." });
    } finally {
      setAddingToCalendar(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] p-4 text-white md:p-8 lg:p-12">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-12 lg:grid-rows-[auto_auto_1fr]">
        
        {/* Header / Nav */}
        <header className="col-span-12 flex items-center justify-between rounded-3xl border border-white/10 bg-[#0F0F10] px-8 py-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-white" />
            <span className="font-semibold tracking-tight">Flowdate OS</span>
          </div>
          <nav className="hidden gap-6 text-sm text-white/40 md:flex">
            <a href="#" className="hover:text-white">Product</a>
            <a href="#" className="hover:text-white">Manifesto</a>
            <a href="#" className="hover:text-white">Pricing</a>
          </nav>
          <div className="flex items-center gap-4">
            {authLoading ? (
              <span className="text-sm text-white/40">...</span>
            ) : user ? (
              <div className="flex items-center gap-3">
                {user.picture && (
                  <img
                    src={user.picture}
                    alt=""
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <span className="text-sm text-white/80 max-w-[120px] truncate">{user.email}</span>
                <Button href={`${API_BASE}/auth/logout`}>Sign out</Button>
              </div>
            ) : (
              <Button primary href={`${API_BASE}/auth/google`}>
                Sign in with Google
              </Button>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <Card className="col-span-12 flex flex-col justify-between gap-12 lg:col-span-8 lg:row-span-2 min-h-[500px]">
          <div className="space-y-6">
            <Badge>Calendar Intelligence</Badge>
            <h1 className="text-5xl font-medium leading-[1.05] tracking-tight md:text-7xl">
              Plans made<br /> <span className="text-white/40">effortless.</span>
            </h1>
            <p className="max-w-md text-lg text-white/60">
              Type naturally. We parse the chaos, finding time, places, and intent instantly.
            </p>
          </div>
          <div className="flex gap-4">
            <Button primary onClick={() => document.getElementById("playground").scrollIntoView({ behavior: "smooth" })}>
              Try the playground
            </Button>
            <Button>Read the docs</Button>
          </div>
        </Card>

        {/* Stat Card 1 */}
        <Card className="col-span-12 flex flex-col justify-between lg:col-span-4">
          <div className="text-6xl font-medium">0.2s</div>
          <div className="text-white/40">Average parse latency</div>
        </Card>

        {/* Stat Card 2 */}
        <Card className="col-span-12 flex flex-col justify-between lg:col-span-4">
          <div className="space-y-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[85%] bg-white" />
            </div>
            <div className="flex justify-between text-sm">
              <span>Accuracy</span>
              <span className="text-white/40">98.5%</span>
            </div>
          </div>
        </Card>

        {/* Playground Section */}
        <div id="playground" className="col-span-12 grid gap-4 lg:grid-cols-2">
          {/* Input */}
          <Card className="min-h-[400px]">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-medium">Input</h3>
              <Badge>Natural Language</Badge>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., 'Lunch with Sarah at 1pm tomorrow, then gym for an hour'"
              className="h-[200px] w-full resize-none bg-transparent text-xl leading-relaxed text-white placeholder:text-white/20 focus:outline-none"
            />
            <div className="absolute bottom-8 right-8">
              <Button onClick={handleParse} disabled={loading || !input}>
                {loading ? "Processing..." : "Generate Events →"}
              </Button>
            </div>
          </Card>

          {/* Output */}
          <Card className="min-h-[400px]">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-medium">Output</h3>
              <Badge>JSON / ICS</Badge>
            </div>
            {events.length === 0 ? (
              <div className="flex h-[200px] items-center justify-center text-white/20">
                Waiting for input...
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((ev, i) => (
                  <div key={i} className="rounded-xl border border-white/5 bg-white/5 p-4">
                    <div className="flex justify-between">
                      <span className="font-medium">{ev.title}</span>
                      <span className="text-white/40">{ev.start_time || "All day"}</span>
                    </div>
                    <div className="mt-2 text-sm text-white/40">
                      {ev.date} • {ev.location || "No location"}
                    </div>
                  </div>
                ))}
                <div className="pt-2">
                  {user ? (
                    <Button primary onClick={handleAddToCalendar} disabled={addingToCalendar}>
                      {addingToCalendar ? "Adding..." : "Add to Google Calendar"}
                    </Button>
                  ) : (
                    <p className="text-sm text-white/40">Sign in with Google to add these events to your calendar.</p>
                  )}
                  {calendarResult && (
                    <div className="mt-3 text-sm">
                      {calendarResult.error ? (
                        <p className="text-red-400">{calendarResult.error}</p>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-white/60">{calendarResult.added} event{calendarResult.added !== 1 ? "s" : ""} added.</p>
                          {calendarResult.events.map((ev, i) => (
                            <a key={i} href={ev.link} target="_blank" rel="noreferrer" className="block text-white/40 hover:text-white underline truncate">
                              {ev.title}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Footer */}
        <footer className="col-span-12 mt-12 flex justify-between border-t border-white/10 py-12 text-sm text-white/40">
          <div>© 2025 Flowdate Inc.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Twitter</a>
            <a href="#" className="hover:text-white">GitHub</a>
            <a href="#" className="hover:text-white">Discord</a>
          </div>
        </footer>

      </div>
    </div>
  );
}
