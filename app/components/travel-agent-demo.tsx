"use client";

import { FormEvent, useState } from "react";

type Recommendation = { title: string; detail: string };
type ChatMessage = { id: number; role: "user" | "agent"; text?: string; intro?: string; recommendations?: Recommendation[] };

const scenarios: Array<{ matches: string[]; intro: string; recommendations: Recommendation[]; followUp: string }> = [
  { matches: ["prague", "praha"], intro: "Here are a few ideas for Prague that balance culture, an evening out and an easy pace:", recommendations: [{ title: "🎻 Vltava riverside concert", detail: "Saturday · 19:30 · near Náplavka" }, { title: "🏰 Prague Castle after-hours tour", detail: "Friday & Saturday · limited evening slots" }, { title: "🍺 Craft beer tasting in Karlín", detail: "Small group · book ahead · indoor option" }], followUp: "Would you prefer something more local and relaxed, or a bigger event?" },
  { matches: ["berlin", "nightlife", "club"], intro: "For Berlin nightlife, I’d build the evening around one neighborhood and leave room to explore:", recommendations: [{ title: "🎶 Live set in Kreuzberg", detail: "Friday · independent venues and late food nearby" }, { title: "🍸 Cocktail bars around Mitte", detail: "Reserve a first stop, then keep the rest flexible" }, { title: "💃 Late-night club option", detail: "Check door policy and set times on the day" }], followUp: "Do you want something electronic, live music, or more of a bar-hopping evening?" },
  { matches: ["warsaw", "warszawa"], intro: "Here are a few Warsaw options with a mix of culture and evening entertainment:", recommendations: [{ title: "🎭 Theatre or contemporary performance", detail: "Central venues · check same-week listings" }, { title: "🎷 Jazz set near Śródmieście", detail: "Evening sessions · good for a relaxed night out" }, { title: "🍽️ Powiśle dinner + riverside walk", detail: "Flexible timing · easy to combine with an event" }], followUp: "Would you like me to focus on food, music, or a specific part of the city?" },
  { matches: ["restaurant", "food", "dinner", "cultural", "museum", "gallery", "exhibition"], intro: "I can narrow this down into a short plan with one main activity and a good place to eat nearby:", recommendations: [{ title: "🖼️ Local exhibition or museum visit", detail: "Look for late opening hours and timed entry" }, { title: "🍽️ Neighbourhood restaurant shortlist", detail: "Choose by cuisine, budget and walking distance" }, { title: "🎬 Evening cultural event", detail: "Cinema, live music or a small performance" }], followUp: "Tell me the city, budget and preferred atmosphere, and I’ll refine the shortlist." },
];

const fallback = { intro: "I can help turn that into a practical mini-itinerary. Here are a few good starting points:", recommendations: [{ title: "📍 Find one local anchor activity", detail: "A tour, exhibition, live event or food experience" }, { title: "🍽️ Add a nearby place to eat", detail: "Choose based on budget and the time you want to start" }, { title: "🌙 Keep one flexible evening option", detail: "A walk, bar, performance or last-minute event" }], followUp: "Share the city, dates and what kind of atmosphere you want, and I’ll make this more specific." };

const pause = (milliseconds: number) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

export function TravelAgentDemo() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: 0, role: "agent", text: "Hi! Tell me where you’re travelling, when, and what you feel like doing." }]);
  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    const request = input.trim();
    if (!request || isProcessing) return;
    const response = scenarios.find((scenario) => scenario.matches.some((keyword) => request.toLowerCase().includes(keyword))) ?? fallback;
    const messageId = Date.now();
    setMessages((current) => [...current, { id: messageId, role: "user", text: request }]);
    setInput("");
    setIsProcessing(true);
    setStatus("Understanding your request...");
    await pause(500);
    setStatus("Searching for relevant options...");
    await pause(650);
    setStatus("Preparing recommendations...");
    await pause(550);
    setMessages((current) => [...current, { id: messageId + 1, role: "agent", intro: response.intro, recommendations: response.recommendations, text: response.followUp }]);
    setStatus("");
    setIsProcessing(false);
  };

  return <div className="mx-auto w-full max-w-xl overflow-hidden rounded-[1.4rem] border border-slate-700 bg-[#0e1621] shadow-[0_24px_60px_rgba(0,0,0,.28)]">
    <div className="flex items-center gap-3 border-b border-white/10 bg-[#17212b] px-5 py-4"><div className="grid h-9 w-9 place-items-center rounded-full bg-cyan-300 font-mono text-xs font-bold text-slate-950">TA</div><div><p className="text-sm font-medium text-white">Travel Agent</p><p className="text-xs text-cyan-200">bot · online</p></div><span className="ml-auto text-slate-500">•••</span></div>
    <div className="min-h-[360px] space-y-4 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,.08),transparent_28%),#0e1621] px-4 py-6 text-sm leading-6 sm:px-6">{messages.map((message) => message.role === "user" ? <div key={message.id} className="ml-auto max-w-[84%] rounded-2xl rounded-br-md bg-[#2b5278] px-4 py-3 text-slate-100">{message.text}<span className="ml-2 text-[10px] text-blue-200">now ✓✓</span></div> : <div key={message.id} className="max-w-[92%] rounded-2xl rounded-bl-md bg-[#182533] px-4 py-3 text-slate-200">{message.intro && <p>{message.intro}</p>}{message.recommendations && <div className="mt-3 space-y-3">{message.recommendations.map((recommendation) => <div key={recommendation.title} className="rounded-xl border border-white/10 bg-[#213140] p-3"><p className="font-medium text-white">{recommendation.title}</p><p className="mt-1 text-xs text-slate-400">{recommendation.detail}</p></div>)}</div>}{message.text && <p className={message.intro ? "mt-3" : ""}>{message.text}</p>}<span className="text-[10px] text-slate-500">{message.id === 0 ? "start" : "now"}</span></div>)}{status && <div className="max-w-[72%] rounded-2xl rounded-bl-md bg-[#182533] px-4 py-3 text-slate-300"><span className="inline-flex items-center gap-2"><i className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />{status}</span></div>}</div>
    <form onSubmit={sendMessage} className="flex items-center gap-3 border-t border-white/10 bg-[#17212b] px-4 py-3"><span className="text-slate-500">◉</span><input value={input} onChange={(event) => setInput(event.target.value)} disabled={isProcessing} placeholder="Write a message…" aria-label="Travel request" className="min-w-0 flex-1 rounded-full bg-[#0e1621] px-4 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:ring-1 focus:ring-cyan-300/60 disabled:opacity-60" /><button type="submit" disabled={!input.trim() || isProcessing} className="rounded-full bg-cyan-300 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-400">Send</button></form>
  </div>;
}
