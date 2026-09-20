// api/collect-cnpj.js
// Função serverless da Vercel — recebe um CNPJ do chat do site, confere o
// formato e registra nos logs da própria Vercel (aba "Logs"/"Functions"
// do projeto). Não precisa de nenhuma credencial ou serviço externo.
//
// Quando quiser automatizar o registro em um CRM/sistema de atendimento
// de verdade, é só trocar este arquivo por uma versão que chama a API
// desse sistema — o resto do site não muda.

function isValidCNPJ(raw) {
  const cnpj = String(raw).replace(/[^\d]/g, "");
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false; // todos os digitos iguais

  const calcCheckDigit = (base) => {
    let sum = 0;
    let pos = base.length - 7;
    for (let i = base.length; i >= 1; i--) {
      sum += Number(base.charAt(base.length - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    const result = sum % 11;
    return result < 2 ? 0 : 11 - result;
  };

  const digits = cnpj.substring(12);
  if (calcCheckDigit(cnpj.substring(0, 12)) !== Number(digits.charAt(0))) return false;
  if (calcCheckDigit(cnpj.substring(0, 13)) !== Number(digits.charAt(1))) return false;

  return true;
}

function formatCNPJ(raw) {
  const c = String(raw).replace(/[^\d]/g, "");
  return c.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { cnpj } = req.body || {};

  if (!cnpj || !isValidCNPJ(cnpj)) {
    return res.status(400).json({ error: "CNPJ inválido" });
  }

  const formatted = formatCNPJ(cnpj);
  const timestamp = new Date().toISOString();

  // Isso aparece na aba "Logs" (Runtime/Function Logs) do projeto na Vercel
  console.log(`[CNPJ COLETADO] ${timestamp} — ${formatted}`);

  return res.status(200).json({ success: true, cnpj: formatted });
}
