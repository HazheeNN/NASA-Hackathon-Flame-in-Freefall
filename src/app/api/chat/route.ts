import { z } from "zod";
import { allow, cleanCitations, isGrounded } from "@/lib/chat/guard";
import { CHAT_INSTRUCTIONS } from "@/lib/chat/instructions";
import { knowledgeFor, preparedAnswer } from "@/lib/chat/knowledge";
import { askProviders } from "@/lib/chat/providers";

// POST /api/chat: the live assistant. Groq → Gemini (AI_ORDER) → closest prepared answer.
// Every reply is checked: citations must point to findings the model was given.

const Body = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(2000) }))
    .min(1)
    .max(8)
    // Visitors' questions are capped at 600 characters; earlier answers are context only.
    .refine((ms) => ms.every((m) => m.role === "assistant" || m.content.length <= 600)),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!allow(ip)) {
    return Response.json({ answer: "You've asked a lot of questions in a short time. Please wait a few minutes, or browse the prepared answers on the Ask page.", provider: "limit" }, { status: 429 });
  }
  const parsed = Body.safeParse(await request.json().catch(() => null));
  const turns = parsed.success ? parsed.data.messages.slice(-6) : null;
  if (!turns || turns[turns.length - 1].role !== "user") {
    return Response.json({ answer: "Please type a question (up to 600 characters).", provider: "invalid" }, { status: 400 });
  }

  const question = turns[turns.length - 1].content;
  const context = turns.filter((t) => t.role === "user").map((t) => t.content).join(" ");
  const { text, allowed } = knowledgeFor(context);
  const system = `${CHAT_INSTRUCTIONS}\n\n${text}`;

  let checked: { text: string; ids: string[] } | null = null;
  const reply = await askProviders(system, turns, (r) => {
    checked = cleanCitations(r.text, allowed);
    return isGrounded(checked.text, checked.ids);
  });
  if (reply && checked) {
    const c = checked as { text: string; ids: string[] };
    return Response.json({ answer: c.text, provider: reply.provider, model: reply.model, findingIds: c.ids });
  }

  const prepared = preparedAnswer(question);
  if (prepared) {
    return Response.json({ answer: prepared.answer, provider: "prepared", question: prepared.question, findingIds: prepared.findingIds });
  }
  return Response.json({
    answer: "I can't answer that right now from our verified NASA data. Try rephrasing, or browse the prepared answers on the Ask page.",
    provider: "none",
  });
}
