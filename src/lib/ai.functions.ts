import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(30),
});

const SYSTEM_PROMPT = `Você é a SYMETRA AI, assistente de atendimento inicial de uma plataforma de tecnologia para estética profissional.
Responsabilidades: acolher o usuário, responder dúvidas básicas sobre a plataforma e sobre tipos de procedimentos de forma genérica, coletar informações para a ficha inicial (nome, idade, cidade, objetivo estético, área de interesse, histórico relevante, disponibilidade) e qualificar o interesse.
Regras obrigatórias:
- NUNCA faça diagnóstico, não indique medicamentos, dosagens ou protocolos clínicos personalizados.
- Sempre reforce que a avaliação com um profissional habilitado é indispensável.
- Faça no máximo duas perguntas por resposta.
- Responda em português do Brasil, com tom profissional, claro e objetivo. Use frases curtas.`;

export const askSymetraAI = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("Assistente indisponível no momento.");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "google/gemini-3.5-flash",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...data.messages],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) throw new Error("Muitas solicitações. Tente novamente em instantes.");
      throw new Error("Não foi possível falar com a assistente agora.");
    }

    const payload = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return {
      reply:
        payload.choices?.[0]?.message?.content ??
        "Não consegui elaborar uma resposta. Pode reformular?",
    };
  });
