import { useState } from "react";

const LABS_STRIP = ["V0.9 beta access", "Strict JSON export", "Playground on deck", "Built with Gemini 1.5", "Calm operating system"];

const TRUSTED = ["Product Hunt", "Linear", "Superhuman", "Read.cv", "Notion", "Each"];

const TIMELINE = [
  { title: "Research block", detail: "Deck edits / 90 min", time: "09:00" },
  { title: "Investor sync", detail: "Downtown / color notes", time: "12:30" },
  { title: "Studio night", detail: "Phones off / 2 hr", time: "20:00" },
  { title: "Write color notes", detail: "Layer in linear tasks", time: "21:15" },
];

const METRICS = [
  { label: "Avg prep", value: "48 s" },
  { label: "Clarity", value: "93 %" },
  { label: "Ways to speak", value: "INF" },
  { label: "Systems", value: "ICS + JSON" },
];

const FEATURE_CARDS = [
  {
    title: "Free-type anything",
    body: "Paragraphs, bullets, captions, even screens transcribed by your OS. We interpret the chaos so you do not conform to UI.",
  },
  {
    title: "Intent modeling",
    body: "Gemini reads fuzzy intent, splits todos from events, sets energy windows, and keeps priorities honest.",
  },
  {
    title: "Studio-grade export",
    body: "Clean JSON plus ICS so you can push to Google, Outlook, Notion, Linear, or your own stack instantly.",
  },
];

const INTENT_MANUAL = [
  { heading: "01 / Capture", body: "Write like a text to a friend. No dropdowns, no fake productivity chrome." },
  { heading: "02 / Parse", body: "Gemini 1.5 Flash runs inside a strict schema so every response stays predictable." },
  { heading: "03 / Publish", body: "Review, nudge, then export to calendars or use the JSON wherever you need." },
];

function formatTime(value) {
  return value || "Time TBD";
}

function ChromeHeader({ onCta }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#030304]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 text-[11px] uppercase tracking-[0.4em] text-white/70">
        <div className="flex items-center gap-4">
          <span className="text-white">CLUELY CALENDAR OS</span>
          <span className="h-px w-12 bg-white/20" />
          <span className="text-white/40">Modern operating surface</span>
        </div>
        <button onClick={onCta} className="rounded-full border border-white/25 px-4 py-1 text-[11px] font-semibold text-white tracking-[0.3em]">
          Launch playground
        </button>
      </div>
    </header>
  );
}

function HeroRail() {
  return (
    <div className="overflow-hidden rounded-full border border-white/15 bg-[#050505] p-2">
      <div className="flex items-center justify-between rounded-full border border-white/15 px-6 py-2 text-[11px] uppercase tracking-[0.35em] text-white/70">
        <span className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          AI view engaged
        </span>
        <span className="text-white/40">Watch it parse →</span>
      </div>
    </div>
  );
}

function SplitHero({ onPrimary }) {
  return (
    <section id="product" className="border-b border-white/5 px-6 py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 lg:flex-row">
        <div className="flex flex-1 flex-col gap-8">
          <HeroRail />
          <div>
            <p className="text-[11px] uppercase tracking-[0.5em] text-white/50">Cluelycalendar OS</p>
            <h1 className="mt-4 text-[52px] leading-[1.05] text-white">
              The calendar that looks like Cluely and actually understands messy humans.
            </h1>
          </div>
          <p className="max-w-xl text-lg text-zinc-400">
            We stripped gradients, tightened the grid, and let AI do the admin. Type whatever, get a calm operating view back.
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={onPrimary} className="rounded-full border border-white/80 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-black">
              Try the playground
            </button>
            <button
              onClick={() => document.querySelector("#playground")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-full border border-white/20 px-6 py-3 text-sm uppercase tracking-[0.35em] text-white/60"
            >
              Watch it parse
            </button>
          </div>
        </div>
        <div className="flex-1 rounded-[36px] border border-white/15 bg-[#050505] p-8">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.35em] text-white/50">
            <span>Today</span>
            <span>AI view</span>
          </div>
          <div className="mt-6 space-y-6">
            {TIMELINE.slice(0, 3).map((event) => (
              <div key={event.title} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-t border-white/15 pt-4 first:border-t-0 first:pt-0">
                <span className="text-sm text-white/40">{event.time}</span>
                <div>
                  <p className="text-xl text-white">{event.title}</p>
                  <p className="text-sm text-white/40">{event.detail}</p>
                </div>
                <span className="text-[10px] uppercase tracking-[0.4em] text-white/40">AI</span>
              </div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.35em] text-white/40">
            {METRICS.slice(0, 2).map((metric) => (
              <div key={metric.label}>
                <p className="text-2xl text-white">{metric.value}</p>
                <p>{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LabsTape() {
  return (
    <section className="border-b border-white/10 bg-[#020202] px-6 py-5">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-6 text-[10px] uppercase tracking-[0.5em] text-white/40">
        {LABS_STRIP.map((item) => (
          <div key={item} className="flex items-center gap-4">
            <span>{item}</span>
            <span className="h-px w-12 bg-white/10" />
          </div>
        ))}
      </div>
    </section>
  );
}

function SchedulePanel() {
  return (
    <section className="border-b border-white/5 px-6 py-20">
      <div className="mx-auto max-w-6xl rounded-[40px] border border-white/15 bg-[#050505] p-10">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.45em] text-white/50">
          <span>Today</span>
          <span>AI view</span>
        </div>
        <div className="mt-8 divide-y divide-white/15">
          {TIMELINE.map((event) => (
            <div key={event.title} className="grid grid-cols-[120px_1fr_120px] items-center gap-6 py-6 text-white">
              <div className="text-sm text-white/40">{formatTime(event.time)}</div>
              <div>
                <p className="text-2xl">{event.title}</p>
                <p className="text-sm text-white/40">{event.detail}</p>
              </div>
              <div className="text-right text-[10px] uppercase tracking-[0.4em] text-white/40">AI view</div>
            </div>
          ))}
        </div>
        <div className="mt-10 grid grid-cols-4 border-t border-white/10 pt-6 text-center text-xs uppercase tracking-[0.45em] text-white/40">
          {METRICS.map((metric) => (
            <div key={metric.label}>
              <p className="text-3xl text-white">{metric.value}</p>
              <p>{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustedRow() {
  return (
    <section className="border-b border-white/5 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 text-[11px] uppercase tracking-[0.5em] text-white/40">
        {TRUSTED.map((logo) => (
          <span key={logo} className="text-white/70">
            {logo}
          </span>
        ))}
      </div>
    </section>
  );
}

function FeatureDeck() {
  return (
    <section className="border-b border-white/5 px-6 py-20">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        {FEATURE_CARDS.map((card) => (
          <div key={card.title} className="flex h-full flex-col gap-4 rounded-3xl border border-white/10 p-6">
            <p className="text-[11px] uppercase tracking-[0.5em] text-white/50">{card.title}</p>
            <p className="text-lg text-white/80">{card.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function IntentDiagram() {
  return (
    <section className="border-b border-white/5 px-6 py-20">
      <div className="mx-auto max-w-5xl space-y-10">
        <div>
          <p className="text-[11px] uppercase tracking-[0.5em] text-white/50">Operating manual</p>
          <h2 className="mt-4 text-3xl text-white">How you go from chaos to calendar.</h2>
        </div>
        <div className="space-y-6">
          {INTENT_MANUAL.map((row) => (
            <div key={row.heading} className="flex flex-col gap-4 border-t border-white/15 pt-6 sm:flex-row sm:items-start sm:justify-between">
              <p className="text-sm uppercase tracking-[0.4em] text-white/50">{row.heading}</p>
              <p className="max-w-2xl text-lg text-white/80">{row.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Playground() {
  const [input, setInput] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleParse() {
    if (!input.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/parse-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      if (!res.ok) {
        throw new Error("Backend error");
      }

      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Check the FastAPI service and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="playground" className="border-b border-white/5 px-6 py-20">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
        <div className="space-y-4 rounded-[32px] border border-white/12 bg-[#040404] p-8">
          <p className="text-[11px] uppercase tracking-[0.45em] text-white/50">Free-type</p>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={8}
            placeholder='"math exam Tuesday at 2pm, gym tomorrow at 6, dinner with Sam Friday night"'
            className="w-full resize-none bg-transparent text-lg text-white outline-none placeholder:text-white/30"
          />
          <button
            onClick={handleParse}
            disabled={loading || !input.trim()}
            className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white disabled:border-white/10 disabled:text-white/30"
          >
            {loading ? "Parsing" : "Parse schedule"}
          </button>
          {error && <p className="text-sm text-rose-400">{error}</p>}
        </div>
        <div className="space-y-4 rounded-[32px] border border-white/12 bg-[#040404] p-8">
          <p className="text-[11px] uppercase tracking-[0.45em] text-white/50">AI view</p>
          {events.length === 0 && !loading && (
            <div className="rounded-2xl border border-dashed border-white/10 p-6 text-sm text-white/40">
              Parsed events land here. Keep it messy.
            </div>
          )}
          <div className="space-y-4">
            {events.map((event, index) => (
              <div key={`${event.title}-${index}`} className="rounded-2xl border border-white/10 p-5">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <p className="text-xl">{event.title || "Untitled"}</p>
                    <p className="text-sm text-white/40">{event.location || "No location"}</p>
                  </div>
                  <span className="text-sm text-white/40">{event.all_day ? "All day" : formatTime(event.start_time)}</span>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-white/50">
                  <p>Date — {event.date || "TBD"}</p>
                  {event.reminder_minutes_before && <p>Reminder — {event.reminder_minutes_before} min prior</p>}
                  {event.notes && <p>Notes — {event.notes}</p>}
                </div>
              </div>
            ))}
          </div>
          {events.length > 0 && (
            <details className="rounded-2xl border border-white/10 p-4 text-sm text-white/60">
              <summary className="cursor-pointer text-white">View JSON</summary>
              <pre className="mt-3 overflow-x-auto text-xs text-white/50">{JSON.stringify({ events }, null, 2)}</pre>
            </details>
          )}
        </div>
      </div>
    </section>
  );
}

function FooterCta({ onPrimary }) {
  return (
    <section id="cta" className="px-6 py-20">
      <div className="mx-auto max-w-4xl rounded-[40px] border border-white/15 bg-[#050505] p-12 text-center">
        <p className="text-[11px] uppercase tracking-[0.5em] text-white/50">Beta access</p>
        <h2 className="mt-4 text-4xl text-white">This finally feels modern. Now ship it.</h2>
        <p className="mt-4 text-lg text-white/60">
          Request the private beta, plug in your AI key, and hand the boring coordination over to Cluely.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button onClick={onPrimary} className="rounded-full border border-white/80 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-black">
            Enter playground
          </button>
          <button className="rounded-full border border-white/20 px-6 py-3 text-sm uppercase tracking-[0.35em] text-white/60">
            Download one-pager
          </button>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const scrollToPlayground = () => document.querySelector("#playground")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-[#030304] text-white">
      <ChromeHeader onCta={scrollToPlayground} />
      <main>
        <SplitHero onPrimary={scrollToPlayground} />
        <LabsTape />
        <SchedulePanel />
        <TrustedRow />
        <FeatureDeck />
        <IntentDiagram />
        <Playground />
        <FooterCta onPrimary={scrollToPlayground} />
      </main>
    </div>
  );
}
