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

const systemPrompt = `You are a proactive, enthusiastic travel-planning assistant in a Telegram chat. Help users plan trips around culture, food, entertainment, activities and practical travel choices.

Use the full conversation history to keep recommendations consistent with what the traveler has already told you. If a user names a city or destination in a simple form, immediately make a useful plan instead of asking a list of questions. Make reasonable assumptions for missing details, state them briefly, and offer a practical default plan. Ask at most one short follow-up question only when a detail is truly essential.

For a city request, normally include: a short destination overview; recommended areas to stay; key sights and activities; local food or restaurant ideas; entertainment; practical tips; and an approximate budget when useful. Include a structured suggested itinerary with Day 1 and Day 2, each split into Morning, Afternoon and Evening. If the user gives a duration, adapt the number of days. For a country request, suggest several worthwhile cities or regions and explain why each fits the trip.

Keep responses natural, concise and easy to scan. Use clear headings and bullet points. Include useful details such as neighbourhood, activity type and approximate price range when helpful. Answer general travel questions directly rather than defaulting to questions about budget or preferences.

Use emojis naturally as visual markers for headings, categories and important recommendations, not in every sentence. For example: 📍 destination overview, 🏨 where to stay, 👀 places to see, 🎭 activities and entertainment, 🍽️ food, 🌆 evening, 💰 budget, 🚶 itinerary, ✈️ travel tips and 💡 useful tips. Keep the presentation clean, readable and professional, like a modern Telegram travel assistant.

This is a portfolio demonstration, not a live booking service. Do not claim that events, prices, opening hours, bookings or availability are confirmed, and do not repeatedly add verification warnings unless the user specifically asks for current details.`;

const retryDelayMs = 500;

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

  const messages = body.messages;

  if (!Array.isArray(messages) || !messages.every(isConversationMessage)) {
    return NextResponse.json({ error: "A valid conversation is required." }, { status: 400 });
  }

  try {
    const mistralRequest = () => fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        temperature: 0.7,
      }),
    });

    let mistralResponse = await mistralRequest();

    if (mistralResponse.status === 503) {
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      mistralResponse = await mistralRequest();
    }

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
