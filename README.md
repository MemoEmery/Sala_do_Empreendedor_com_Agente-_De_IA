# Sala do Empreendedor — Triunfo-PE

Landing page institucional da **Sala do Empreendedor de Triunfo-PE**, funcionando
como uma central de capacitações com os cursos gratuitos da **Loja Sebrae**.

O objetivo do projeto é simples: transformar uma lista de cursos em uma
experiência de descoberta — o visitante entra, busca ou navega por categoria,
encontra a capacitação certa para o momento do negócio dele e acessa direto
na Loja Sebrae.

## ✨ Funcionalidades

- **Busca em tempo real** entre os 37 cursos disponíveis
- **Filtros por categoria**: Marketing e Vendas, Finanças, Planejamento e
  Empreendedorismo
- **Trilhas de aprendizagem**: quatro jornadas guiadas de acordo com o
  objetivo do empreendedor (vender mais, organizar as finanças, planejar o
  negócio ou começar a empreender)
- **Chat com IA**: um assistente virtual que tira dúvidas sobre vendas,
  finanças, planejamento e empreendedorismo, e recomenda cursos reais da
  lista de acordo com a necessidade descrita pelo visitante
- **100% responsivo**: desktop, tablet e celular
- **Acesso direto** a cada curso na Loja Sebrae, sem etapas extras

## 🖼️ Estrutura da página

1. **Header** fixo com navegação e atalho de busca
2. **Hero** com busca e contador de cursos disponíveis
3. **Categorias** — quatro áreas principais de capacitação
4. **Cursos em destaque** — grade com todos os cursos, filtrável
5. **Trilhas de aprendizagem** — jornada guiada por objetivo
6. **Estatísticas** — números da central de capacitações
7. **Chamada final** para conhecer a Sala do Empreendedor
8. **Footer** com todos os links e redes de contato
9. **Chat com IA** flutuante, disponível em qualquer ponto da página

## 🛠️ Tecnologias

- **React** + **Vite** — interface e build
- **Tailwind CSS** — estilização
- **lucide-react** — ícones
- **Google Gemini API** — inteligência do chat (tier gratuito)
- **Vercel** — hospedagem e função serverless (`api/chat.js`) que protege a
  chave de API do Gemini

## 📂 Estrutura de pastas

```
meu-projeto/
├── api/
│   └── chat.js          # backend serverless: fala com o Gemini em segurança
├── src/
│   ├── sala-do-empreendedor.jsx   # página inteira (componente React)
│   ├── main.jsx                   # ponto de entrada do React
│   └── index.css                  # diretivas do Tailwind
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .env.example
```

## 🚀 Rodando localmente

```bash
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (normalmente `http://localhost:5173`).

> O chat com IA não responde em `npm run dev` sozinho — a função `api/chat.js`
> só roda de verdade publicada na Vercel (ou localmente via `vercel dev`,
> depois de `npm install -g vercel`). O resto da página funciona normalmente.

## 🌐 Publicando (deploy)

O passo a passo completo — gerar chave gratuita do Gemini, configurar na
Vercel e publicar — está em [`README-deploy-chat.md`](./README-deploy-chat.md).

Resumo rápido:
1. Gere uma chave gratuita em [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Suba o projeto para um repositório no GitHub
3. Importe o repositório na [Vercel](https://vercel.com)
4. Configure a variável de ambiente `GEMINI_API_KEY`
5. Deploy 🎉

## 🤖 Sobre o chat com IA

O assistente conhece os 37 cursos (título, categoria e link) e foi
instruído a:
- recomendar no máximo 3 cursos por resposta, sempre com nome e link reais;
- nunca inventar curso, duração, preço, certificado ou nível que não exista
  na lista;
- responder em português, de forma curta, prática e acolhedora;
- tirar dúvidas gerais sobre vendas, finanças, planejamento e
  empreendedorismo.

As conversas não ficam salvas em nenhum lugar — existem apenas na memória do
navegador de quem está usando o chat.

## 📍 Sobre a Sala do Empreendedor

A Sala do Empreendedor de Triunfo-PE é um espaço de apoio, orientação e
capacitação para empreendedores do município, em parceria com o Sebrae.

---

Feito com 💙 para fortalecer o empreendedorismo em Triunfo-PE.
