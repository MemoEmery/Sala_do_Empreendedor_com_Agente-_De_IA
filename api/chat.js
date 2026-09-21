// api/chat.js
// Função serverless da Vercel — roda quando o front-end chama "/api/chat".
// Usa a API GRATUITA do Google Gemini. A chave fica só aqui no servidor,
// nunca é enviada para o navegador do visitante.

// Modelo principal (mantido do seu código). Pode ser trocado na Vercel
// pela variável GEMINI_MODEL sem precisar mexer no código.
const PRIMARY_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";

// Modelo reserva, usado se o principal continuar sobrecarregado.
// Opcional: defina GEMINI_FALLBACK_MODEL na Vercel com um nome de modelo
// válido da sua conta. Se ficar vazio, o código só repete o principal.
const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL || "";

// Status que costumam ser temporários e valem uma nova tentativa.
const RETRYABLE_STATUS = new Set([500, 502, 503, 504]);

// Tempo total máximo da função (ms). Mantido abaixo de 10s, que é o limite
// padrão de funções no plano gratuito da Vercel.
const TOTAL_BUDGET_MS = 8500;

// Limites simples para proteger sua cota gratuita.
const MAX_MESSAGES = 20;
const MAX_CHARS_PER_MESSAGE = 2000;
const MAX_SYSTEM_CHARS = 4000;

const MSG_BUSY =
  "O assistente está com muita demanda agora. Tente novamente em alguns instantes — enquanto isso, você pode pesquisar os cursos direto na página.";
const MSG_RATE_LIMIT =
  "Estamos com bastante gente conversando agora 🙂 Aguarde alguns segundos e tente de novo.";
const MSG_GENERIC =
  "Não foi possível processar a solicitação. Tente novamente.";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function callGemini(model, apiKey, body, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      }
    );
    const data = await response.json().catch(() => ({}));
    return { response, data };
  } finally {
    clearTimeout(timer);
  }
}

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
    const contents = messages.slice(-MAX_MESSAGES).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: String(m.content || "").slice(0, MAX_CHARS_PER_MESSAGE) }],
    }));

    const body = {
      contents,
      ...(system
        ? {
            systemInstruction: {
              parts: [{ text: String(system).slice(0, MAX_SYSTEM_CHARS) }],
            },
          }
        : {}),
      generationConfig: {
        maxOutputTokens: 1000,
        thinkingConfig: { thinkingBudget: 0 },
      },
    };

    // Ordem das tentativas: principal, principal de novo, e reserva (se houver).
    const attempts = [PRIMARY_MODEL, PRIMARY_MODEL];
    if (FALLBACK_MODEL && FALLBACK_MODEL !== PRIMARY_MODEL) {
      attempts.push(FALLBACK_MODEL);
    }

    const deadline = Date.now() + TOTAL_BUDGET_MS;
    let lastWasRateLimit = false;

    for (let i = 0; i < attempts.length; i++) {
      const remaining = deadline - Date.now();
      if (remaining < 1500) break; // sem tempo útil para outra tentativa

      let result;
      try {
        result = await callGemini(attempts[i], apiKey, body, remaining);
      } catch (networkErr) {
        // Timeout ou falha de rede: trata como temporário.
        console.error(`Falha de rede/timeout (${attempts[i]}):`, networkErr.name);
        if (i < attempts.length - 1) await sleep(700 * (i + 1));
        continue;
      }

      const { response, data } = result;

      if (response.ok) {
        const replyText =
          data?.candidates?.[0]?.content?.parts
            ?.map((p) => p.text || "")
            .join("") || "";

        if (!replyText) {
          // Resposta vazia (ex.: bloqueio de segurança do modelo).
          console.error("Resposta vazia do Gemini:", JSON.stringify(data));
          return res.status(502).json({ error: MSG_GENERIC });
        }

        // Normaliza a resposta no mesmo formato que o front-end já espera
        // (igual ao formato da API da Anthropic), para não precisar mexer no React.
        return res.status(200).json({
          content: [{ type: "text", text: replyText }],
        });
      }

      console.error(`Erro da API Gemini (${attempts[i]}, ${response.status}):`, data);

      // 429 = limite de pedidos por minuto do tier gratuito.
      if (response.status === 429) {
        lastWasRateLimit = true;
        return res.status(429).json({ error: MSG_RATE_LIMIT });
      }

      // Erros temporários: espera um pouco e tenta de novo.
      if (RETRYABLE_STATUS.has(response.status)) {
        if (i < attempts.length - 1) await sleep(700 * (i + 1));
        continue;
      }

      // Outros erros (400, 403, 404...) não adianta repetir e o texto do
      // Google não deve chegar ao visitante. O detalhe fica no log da Vercel.
      return res.status(502).json({ error: MSG_GENERIC });
    }

    return res.status(lastWasRateLimit ? 429 : 503).json({ error: MSG_BUSY });
  } catch (err) {
    console.error("Erro no proxy /api/chat:", err);
    return res.status(500).json({ error: MSG_GENERIC });
  }
}
