# Sala do Empreendedor — Triunfo-PE

Landing page institucional da **Sala do Empreendedor de Triunfo-PE**, funcionando
como uma central de capacitações com os cursos gratuitos da **Loja Sebrae**.

O objetivo do projeto é simples: transformar uma lista de cursos em uma
experiência de descoberta — o visitante entra, busca ou navega por categoria,
encontra a capacitação certa para o momento do negócio dele e acessa direto
na Loja Sebrae.

## ✨ Funcionalidades

- **Busca em tempo real** entre os cursos disponíveis
- **Filtros por categoria**: Marketing e Vendas, Finanças, Planejamento e
  Empreendedorismo
- **Trilhas de aprendizagem**: jornadas guiadas de acordo com o objetivo do
  empreendedor
- **Chat com IA**: um assistente virtual que ajuda o visitante a encontrar a
  capacitação certa para o momento do negócio dele
- **100% responsivo**: desktop, tablet e celular
- **Acesso direto** a cada curso na Loja Sebrae, sem etapas extras

## 🛠️ Tecnologias

- **React** + **Vite** — interface e build
- **Tailwind CSS** — estilização
- **Vercel** — hospedagem e backend leve, responsável por proteger as
  credenciais usadas pelo chat

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

O assistente ajuda o visitante a encontrar a capacitação certa dentro do
catálogo oficial de cursos, conversando de forma natural sobre a necessidade
do negócio. As regras de comportamento e o funcionamento interno do
assistente ficam documentados separadamente (fora deste README público).

As conversas não ficam salvas em nenhum lugar — existem apenas na memória do
navegador de quem está usando o chat.

## 📍 Sobre a Sala do Empreendedor

A Sala do Empreendedor de Triunfo-PE é um espaço de apoio, orientação e
capacitação para empreendedores do município, em parceria com o Sebrae.

---

Feito com 💙 para fortalecer o empreendedorismo em Triunfo-PE.
