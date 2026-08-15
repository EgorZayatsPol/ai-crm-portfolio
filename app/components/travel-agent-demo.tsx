"use client";

import { FormEvent, useEffect, useState } from "react";

type ChatMessage = {
  id: number;
  role: "user" | "agent";
  text: string;
};

type TravelAgentResponse = {
  message?: string;
  error?: string;
};

const pause = (milliseconds: number) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

const travelHintStorageKey = "travel-agent-hint-dismissed";

export function TravelAgentDemo() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      role: "agent",
      text: "Hi! Tell me where you’re travelling, when, and what you feel like doing.",
    },
  ]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [showTravelHint, setShowTravelHint] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setShowTravelHint(sessionStorage.getItem(travelHintStorageKey) !== "true");
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  const dismissTravelHint = () => {
    sessionStorage.setItem(travelHintStorageKey, "true");
    setShowTravelHint(false);
  };

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();

    const request = input.trim();
    if (!request || isProcessing) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      text: request,
    };
    const conversation = [...messages, userMessage].map((message) => ({
      role: message.role === "agent" ? "assistant" : "user",
      content: message.text,
    }));

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setError("");
    setIsProcessing(true);
    setStatus("Understanding your request...");

    try {
      const responsePromise = fetch("/api/travel-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversation }),
      });

      await pause(350);
      setStatus("Searching for relevant options...");
      await pause(400);
      setStatus("Preparing recommendations...");

      const response = await responsePromise;
      const payload = (await response.json()) as TravelAgentResponse;
      const responseMessage = payload.message;

      if (!response.ok || !responseMessage) {
        throw new Error(payload.error ?? "The travel assistant could not respond.");
      }

      setMessages((current) => [
        ...current,
        { id: Date.now() + 1, role: "agent", text: responseMessage },
      ]);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "The travel assistant could not respond. Please try again.",
      );
    } finally {
      setStatus("");
      setIsProcessing(false);
    }
  };

  return <div className="mx-auto w-full max-w-xl">
    {showTravelHint && <aside className="mb-3 ml-auto max-w-sm rounded-xl border border-cyan-300/20 bg-cyan-300/[.07] px-4 py-3 text-sm leading-5 text-cyan-50 shadow-[0_12px_30px_rgba(0,0,0,.18)]"><div className="flex items-start gap-3"><p className="flex-1">✈️ <span className="font-medium">Where would you like to travel?</span><br /><span className="text-xs text-cyan-100/70">Try: Paris, Barcelona, Tokyo or “I want a 3-day trip to Rome”.</span></p><button type="button" onClick={dismissTravelHint} aria-label="Dismiss travel suggestions" className="-mr-1 -mt-1 rounded-md px-1.5 py-0.5 text-base leading-none text-cyan-100/60 transition hover:bg-white/10 hover:text-white">×</button></div></aside>}
    <div className="overflow-hidden rounded-[1.4rem] border border-slate-700 bg-[#0e1621] shadow-[0_24px_60px_rgba(0,0,0,.28)]">
    <div className="flex items-center gap-3 border-b border-white/10 bg-[#17212b] px-5 py-4"><div className="grid h-9 w-9 place-items-center rounded-full bg-cyan-300 font-mono text-xs font-bold text-slate-950">TA</div><div><p className="text-sm font-medium text-white">Travel Agent</p><p className="text-xs text-cyan-200">bot · online</p></div><span className="ml-auto text-slate-500">•••</span></div>
    <div className="min-h-[360px] space-y-4 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,.08),transparent_28%),#0e1621] px-4 py-6 text-sm leading-6 sm:px-6">{messages.map((message) => message.role === "user" ? <div key={message.id} className="ml-auto max-w-[84%] rounded-2xl rounded-br-md bg-[#2b5278] px-4 py-3 text-slate-100">{message.text}<span className="ml-2 text-[10px] text-blue-200">now ✓✓</span></div> : <div key={message.id} className="max-w-[92%] whitespace-pre-wrap rounded-2xl rounded-bl-md bg-[#182533] px-4 py-3 text-slate-200"><p>{message.text}</p><span className="text-[10px] text-slate-500">{message.id === 0 ? "start" : "now"}</span></div>)}{status && <div className="max-w-[72%] rounded-2xl rounded-bl-md bg-[#182533] px-4 py-3 text-slate-300"><span className="inline-flex items-center gap-2"><i className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />{status}</span></div>}{error && <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs leading-5 text-rose-200">{error}</p>}</div>
    <form onSubmit={sendMessage} className="flex items-center gap-3 border-t border-white/10 bg-[#17212b] px-4 py-3"><span className="text-slate-500">◉</span><input value={input} onChange={(event) => setInput(event.target.value)} disabled={isProcessing} placeholder="Write a message…" aria-label="Travel request" className="min-w-0 flex-1 rounded-full bg-[#0e1621] px-4 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:ring-1 focus:ring-cyan-300/60 disabled:opacity-60" /><button type="submit" disabled={!input.trim() || isProcessing} className="rounded-full bg-cyan-300 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-400">Send</button></form>
    </div>
  </div>;
}
