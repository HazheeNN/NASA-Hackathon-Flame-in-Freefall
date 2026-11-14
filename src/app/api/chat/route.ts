import { z } from "zod";
import { allow, cleanCitations, isAboutQuestion, isGrounded } from "@/lib/chat/guard";
import { CHAT_INSTRUCTIONS } from "@/lib/chat/instructions";
import { experimentSources, knowledgeFor, preparedAnswer, provenanceAnswer, sourcesFor } from "@/lib/chat/knowledge";
import { askProviders } from "@/lib/chat/providers";

// POST /api/chat: the live assistant. Groq → Gemini (AI_ORDER) → closest prepared answer.
// Every reply is checked: citations must point to findings the model was given; answers about
// where the data comes from may instead name experiments and the Sources page.

// Up to 3 models per provider at 12 s each; Vercel stops the function after this many seconds.
export const maxDuration = 60;

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
  // Last 4 messages; earlier answers shortened (they count against the free tiers' token limits).
  const turns = parsed.success
    ? parsed.data.messages.slice(-4).map((m) => (m.role === "assistant" ? { ...m, content: m.content.slice(0, 500) } : m))
    : null;
  if (!turns || turns[turns.length - 1].role !== "user") {
    return Response.json({ answer: "Please type a question (up to 600 characters).", provider: "invalid" }, { status: 400 });
  }

  const question = turns[turns.length - 1].content;
  const context = turns.filter((t) => t.role === "user").map((t) => t.content).join(" ");
  const { text, allowed } = knowledgeFor(context);
  const system = `${CHAT_INSTRUCTIONS}\n\n${text}`;

  const checked = new Map<string, { text: string; ids: string[]; provenance: boolean }>();
  const { reply, failures } = await askProviders(system, turns, (r) => {
    const c = cleanCitations(r.text, allowed);
    // Fire-science answers must cite; answers about the project itself may not need to.
    const provenance = c.ids.length === 0 && isAboutQuestion(question);
    checked.set(r.text, { ...c, provenance });
    return isGrounded(c.text, c.ids) || provenance;
  });
  if (reply) {
    const c = checked.get(reply.text)!;
    const sources = [...sourcesFor(c.ids), ...(c.ids.length === 0 ? experimentSources(c.text) : [])];
    return Response.json({ answer: c.text, provider: reply.provider, model: reply.model, findingIds: c.ids, sources });
  }

  // Why the live AI didn't answer (provider names and status codes only), shown small under the reply.
  const why = failures.join("; ");
  const fromData = provenanceAnswer(question);
  if (fromData) {
    return Response.json({ answer: fromData.answer, provider: "data", sources: fromData.sources, why });
  }
  const prepared = preparedAnswer(question);
  if (prepared) {
    return Response.json({ answer: prepared.answer, provider: "prepared", question: prepared.question, findingIds: prepared.findingIds, sources: sourcesFor(prepared.findingIds), why });
  }
  return Response.json({
    answer: "I can't answer that right now from our verified NASA data. Try rephrasing, or browse the prepared answers on the Ask page.",
    provider: "none",
    why,
  });
}
