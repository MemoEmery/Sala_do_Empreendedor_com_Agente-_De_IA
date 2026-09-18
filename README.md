# Sala do Empreendedor — Triunfo-PE

Landing page da Central de Capacitações da Sala do Empreendedor de Triunfo-PE,
com busca, filtros por categoria, trilhas de aprendizagem e um chat com IA
que ajuda o visitante a encontrar o curso certo da Loja Sebrae.

## Estrutura do projeto

```
meu-projeto/
├── api/
│   └── chat.js          ← função serverless (proxy seguro para a IA do Gemini)
├── src/
│   ├── sala-do-empreendedor.jsx   ← página inteira (componente React)
│   ├── main.jsx                   ← ponto de entrada do React
│   └── index.css                  ← diretivas do Tailwind
├── index.html            ← HTML raiz (Vite)
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .env.example
```

## Rodando localmente

```bash
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (normalmente `http://localhost:5173`).

> O chat com IA não vai responder em `npm run dev` sozinho, porque a função
> `api/chat.js` só roda de verdade quando publicada na Vercel (ou rodando
> com `vercel dev`, veja abaixo). O resto da página funciona normalmente.

Para testar o chat localmente também, instale a CLI da Vercel e rode:

```bash
npm install -g vercel
vercel dev
```

## Publicando (deploy)

Veja o passo a passo completo em [`README-deploy-chat.md`](./README-deploy-chat.md):
1. Gerar uma chave gratuita no Google AI Studio (Gemini).
2. Subir o projeto para o GitHub.
3. Conectar o repositório na Vercel.
4. Configurar a variável de ambiente na Vercel.
5. Deploy.

## Tecnologias

- React + Vite
- Tailwind CSS
- lucide-react (ícones)
- Google Gemini API (chat com IA, tier gratuito)
- Vercel (hospedagem + função serverless)
