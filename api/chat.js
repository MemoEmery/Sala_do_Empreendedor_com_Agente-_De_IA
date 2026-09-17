// api/chat.js
// Função serverless da Vercel — roda quando o front-end chama "/api/chat".
// Usa a API GRATUITA do Google Gemini. A chave fica só aqui no servidor,
// nunca é enviada para o navegador do visitante.
 
const GEMINI_MODEL = "gemini-3.6-flash"; // modelo atual com tier gratuito
 
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido" });
  }
 
  const apiKey = process.env.GEMINI_API_KEY;
 
  if (!apiKey) {
    console.error("GEMINI_API_KEY não configurada nas variáveis de ambiente");
    return res.status(500).json({
      error: "Configuração do servidor incompleta. Contate o administrador do site.",
    });
  }
 
  try {
    const { system, messages } = req.body || {};
 
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Campo 'messages' inválido ou vazio" });
    }
 
    // Gemini usa "model" no lugar de "assistant", e cada mensagem
    // vem como { role, parts: [{ text }] } em vez de { role, content }
    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: String(m.content || "") }],
    }));
 
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents,
          ...(system
            ? { systemInstruction: { parts: [{ text: system }] } }
            : {}),
          generationConfig: {
            maxOutputTokens: 1000,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      }
    );
 
    const data = await geminiResponse.json();
 
    if (!geminiResponse.ok) {
      console.error("Erro da API Gemini:", data);
      return res.status(geminiResponse.status).json({
        error:
          data?.error?.message ||
          "Erro ao consultar a IA. Tente novamente em instantes.",
      });
    }
 
    const replyText =
      data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text || "")
        .join("") || "";
 
    // Normaliza a resposta no mesmo formato que o front-end já espera
    // (igual ao formato da API da Anthropic), para não precisar mexer no React.
    return res.status(200).json({
      content: [{ type: "text", text: replyText }],
    });
  } catch (err) {
    console.error("Erro no proxy /api/chat:", err);
    return res.status(500).json({
      error: "Não foi possível processar a solicitação. Tente novamente.",
    });
  }
}
 
