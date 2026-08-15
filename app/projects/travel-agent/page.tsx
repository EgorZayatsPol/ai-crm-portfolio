import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "../../components/icons";
import { CodeExamples, type CodeExample } from "../../components/how-it-works";
import { ProjectSectionNavigation } from "../../components/project-section-navigation";
import { TravelAgentDemo } from "../../components/travel-agent-demo";

export const metadata: Metadata = {
  title: "AI Travel & Entertainment Agent — LU.AI",
  description: "A conversational-agent concept for discovering activities and entertainment through Telegram.",
};

const workflow = [
  ["01", "Understand the request", "Interpret natural language to identify destination, dates, interests, group context and practical constraints."],
  ["02", "Plan the search", "Translate the request into targeted activity and entertainment queries that reflect the traveler’s preferences."],
  ["03", "Evaluate options", "Compare returned places and events against relevance, timing, location and the details expressed in the conversation."],
  ["04", "Respond in Telegram", "Return a concise, personalized shortlist the traveler can continue refining through natural conversation."],
];

const codeExamples: CodeExample[] = [
  { number: "01", title: "Capture travel intent", tool: "Python / Telegram", source: "handler.py", summary: "Passes a Telegram message into an intent-extraction step that returns the location, dates and preferences needed to guide the next action.", snippet: `async def handle_message(update, context):
    message = update.message.text
    request = extract_travel_intent(message)

    await update.message.reply_text(
        f"Looking for ideas in {request['city']}…"
    )` },
  { number: "02", title: "Build a focused search", tool: "Python / AI-assisted planning", source: "search.py", summary: "Turns the structured request into a focused query instead of using a broad, generic destination search.", snippet: `query = build_search_query(
    city=request["city"],
    dates=request["dates"],
    interests=request["interests"],
)

results = search_events_and_places(query)` },
  { number: "03", title: "Shape the recommendation", tool: "Python / recommendation logic", source: "recommend.py", summary: "Ranks options against the traveler’s request and formats a clear Telegram-ready response with the most relevant choices.", snippet: `ranked = rank_recommendations(
    results,
    preferences=request["interests"],
    location=request["city"],
)

reply = format_recommendations(ranked[:3])` },
];

export default function TravelAgentPage() {
  return <main className="min-h-screen overflow-hidden">
    <section className="hero-shell grid-lines px-5 pb-20 pt-6 sm:px-8 lg:px-12">
      <nav className="mx-auto flex max-w-6xl items-center justify-between" aria-label="Project navigation"><Link href="/" className="font-mono text-sm font-medium text-white">LU.<span className="text-cyan-300">AI</span></Link><Link href="/#projects" className="text-sm text-slate-300 transition hover:text-cyan-200">← Back to projects</Link></nav>
      <div className="mx-auto max-w-6xl pb-8 pt-24 sm:pt-32">
        <p className="eyebrow"><span className="status-dot" />Agent concept · Telegram interface</p>
        <h1 className="mt-7 max-w-5xl text-5xl font-medium tracking-[-.065em] text-white sm:text-7xl">Travel & Entertainment <span className="text-gradient">Agent</span></h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">A conversational AI agent that helps travelers discover entertainment, activities and places through Telegram and natural language.</p>
        <div className="mt-9 flex flex-wrap gap-2">{["AI Agent", "Telegram", "Voice", "Web Search"].map((tag) => <span key={tag} className="tag">{tag}</span>)}</div>
        <a href="#telegram-demo" className="button-primary mt-10">View Telegram demo <ArrowUpRight /></a>
        <div className="project-art art-agent mt-16 h-56 rounded-2xl sm:h-80"><span>TRAVEL / AGENT 04</span><i /><i /><i /></div>
      </div>
    </section>

    <ProjectSectionNavigation sections={[{ id: "overview", label: "Overview" }, { id: "how-it-works", label: "How It Works" }, { id: "telegram-demo", label: "Telegram Demo" }, { id: "how-ai-was-used", label: "How AI Was Used" }, { id: "code-examples", label: "Code Examples" }, { id: "conclusion", label: "Conclusion" }]} />

    <article className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32"><div className="mx-auto max-w-6xl space-y-28">
      <section id="overview" className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Overview</p><h2 className="mt-5 text-4xl font-medium tracking-[-.055em] text-white sm:text-5xl">Travel ideas through<br /><span className="text-slate-400">a natural conversation.</span></h2></div><div className="max-w-2xl space-y-5 text-base leading-8 text-slate-300"><p>The agent is designed to make discovering activities feel less like navigating several search tabs and more like asking a well-informed local guide. A traveler can describe where they are going, when, and what they enjoy in their own words.</p><p>This page demonstrates the product experience and workflow concept. The Telegram connection, web search and external AI services are not connected in this static portfolio demo.</p></div></section>

      <section className="grid gap-10 lg:grid-cols-2"><div><p className="eyebrow">Problem</p><h2 className="mt-4 text-3xl font-medium tracking-[-.05em] text-white sm:text-4xl">Good plans need context, not just search results.</h2><p className="mt-5 leading-7 text-slate-400">Travelers often need to combine dates, location, mood, budget and practical timing before an activity becomes a useful recommendation. General search can produce too many disconnected options and little help with choosing between them.</p></div><div><p className="eyebrow">How the agent works</p><h2 className="mt-4 text-3xl font-medium tracking-[-.05em] text-white sm:text-4xl">Context flows through every step.</h2><p className="mt-5 leading-7 text-slate-400">The agent keeps the traveler’s request at the center: it extracts useful details, plans a targeted search, evaluates options, and responds with a short, personalized set of suggestions that can be refined in the same conversation.</p></div></section>

      <section id="how-it-works"><p className="eyebrow">How the agent works</p><h2 className="mt-4 text-3xl font-medium tracking-[-.05em] text-white sm:text-4xl">From a message to a useful shortlist.</h2><div className="mt-10 grid gap-3 md:grid-cols-4">{workflow.map(([number, title, description], index) => <article key={title} className="panel relative rounded-xl p-5"><span className="font-mono text-xs text-cyan-300">{number}</span>{index < workflow.length - 1 && <span className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-[#0d1421] text-slate-500 md:grid">→</span>}<h3 className="mt-7 text-lg font-medium text-white">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-500">{description}</p></article>)}</div></section>

      <section id="telegram-demo"><div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr]"><div><p className="eyebrow">Telegram demo</p><h2 className="mt-5 text-3xl font-medium tracking-[-.05em] text-white sm:text-4xl">A travel conversation,<br /><span className="text-slate-400">inside the familiar interface.</span></h2><p className="mt-5 max-w-md leading-7 text-slate-400">Start with a city, country or trip idea. The AI assistant keeps the conversation context and turns a simple destination into a practical travel plan.</p></div><TravelAgentDemo /></div></section>

      <section id="how-ai-was-used" className="rounded-2xl border border-cyan-300/20 bg-cyan-300/[.06] p-7 sm:p-10"><div className="grid gap-10 lg:grid-cols-[.78fr_1.22fr]"><div><p className="eyebrow">How AI was used</p><h2 className="mt-5 text-3xl font-medium tracking-[-.05em] text-white sm:text-4xl">The core of the agent,<br /><span className="text-slate-400">guided by traveler context.</span></h2></div><div><p className="leading-7 text-slate-300">In the intended agent workflow, AI understands natural-language requests, identifies location, preferences and other relevant details, helps formulate focused search queries, analyzes search results, and generates a personalized response.</p><p className="mt-5 leading-7 text-slate-300">The agent is designed to support discovery rather than make decisions for the traveler. Recommendations should remain transparent, grounded in available information and easy for the user to refine.</p><div className="mt-7 flex flex-wrap gap-2">{["Intent understanding", "Location extraction", "Search planning", "Result analysis", "Personalized response"].map((item) => <span key={item} className="rounded-full border border-cyan-300/20 bg-[#080b12]/40 px-3 py-2 font-mono text-[10px] text-cyan-100">{item}</span>)}</div></div></div></section>

      <CodeExamples examples={codeExamples} />

      <section id="conclusion" className="grid gap-10 border-t border-white/10 pt-16 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Conclusion</p><h2 className="mt-4 text-3xl font-medium tracking-[-.05em] text-white sm:text-4xl">A more conversational way to explore a city.</h2></div><p className="max-w-2xl leading-8 text-slate-400">This project demonstrates how an agent can connect natural-language interaction, search planning and personalized recommendations in a familiar messaging channel. The current page is a static demonstration; real Telegram, search and AI integrations are intentionally left for a later implementation phase.</p></section>
      <footer className="flex flex-col justify-between gap-5 border-t border-white/10 pt-10 text-sm sm:flex-row sm:items-center"><Link href="/projects/document-processing" className="text-slate-400 transition hover:text-cyan-200">← Document Processing</Link><Link href="/#projects" className="text-cyan-200 transition hover:text-white">Back to Projects →</Link></footer>
    </div></article>
  </main>;
}
