import { NextResponse } from "next/server";

type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

type MistralResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

const systemPrompt = `You are a helpful travel and entertainment assistant in a Telegram chat. Help users discover activities, attractions, cultural events, restaurants and nightlife. Ask concise follow-up questions when key details such as location, dates, budget or preferences are missing. Be friendly, practical and clear. You do not have web search or real-time availability, so do not present events, opening times or bookings as confirmed. State this limitation when it matters.`;

function isConversationMessage(value: unknown): value is ConversationMessage {
  if (!value || typeof value !== "object") return false;

  const message = value as Record<string, unknown>;
  return (
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string" &&
    message.content.trim().length > 0
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.MISTRAL_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "The travel assistant is not configured yet. Add MISTRAL_API_KEY to .env.local." },
      { status: 503 },
    );
  }

  let body: { messages?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!Array.isArray(body.messages) || !body.messages.every(isConversationMessage)) {
    return NextResponse.json({ error: "A valid conversation is required." }, { status: 400 });
  }

  try {
    const mistralResponse = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [{ role: "system", content: systemPrompt }, ...body.messages],
        temperature: 0.7,
      }),
    });

    if (!mistralResponse.ok) {
      console.error("Mistral API request failed:", mistralResponse.status);
      return NextResponse.json(
        { error: "The travel assistant is temporarily unavailable. Please try again." },
        { status: 502 },
      );
    }

    const payload = (await mistralResponse.json()) as MistralResponse;
    const message = payload.choices?.[0]?.message?.content?.trim();

    if (!message) {
      return NextResponse.json(
        { error: "The travel assistant returned an empty response. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Unable to reach the Mistral API:", error);
    return NextResponse.json(
      { error: "The travel assistant is temporarily unavailable. Please try again." },
      { status: 502 },
    );
  }
}
