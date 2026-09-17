# Colocando o chat com IA para funcionar fora do Claude (Vercel + Gemini grátis)

O chat da Sala do Empreendedor usa IA para responder dúvidas e sugerir cursos.
Fora do Claude, isso funciona com um pequeno backend que guarda a chave de API
em segurança — é o que o arquivo `api/chat.js` faz, usando a **API gratuita
do Google Gemini** (sem cartão de crédito, com um limite diário generoso).

## Passo a passo

### 1. Gere uma chave de API gratuita no Google AI Studio
1. Acesse https://aistudio.google.com/apikey
2. Entre com uma conta Google
3. Clique em **Create API key**
4. Copie a chave gerada — você vai precisar dela no passo 4

> ⚠️ Essa chave é como uma senha. Nunca cole ela dentro do código do site
> (nem no `.jsx`, nem em nenhum arquivo que vá para o navegador do visitante).

> 💡 O tier gratuito do Gemini tem um limite diário de requisições (é
> generoso, mas existe). Se o site crescer muito, talvez seja necessário
> ativar cobrança no Google Cloud para aumentar o limite.

### 2. Organize os arquivos do projeto

Sua estrutura de pastas deve ficar assim:

```
meu-projeto/
├── api/
│   └── chat.js          ← a função que preparei (usa o Gemini)
├── index.html            ← ou os arquivos do seu projeto React/Vite
├── src/
│   └── sala-do-empreendedor.jsx
└── package.json
```

Se você ainda não tem um projeto React montado (Vite, Create React App, etc.),
me avise que eu monto a estrutura completa para você.

### 3. Crie uma conta na Vercel e conecte o projeto
1. Acesse https://vercel.com e crie uma conta (dá para entrar direto com GitHub)
2. Suba seu projeto para um repositório no GitHub
3. Na Vercel, clique em **Add New → Project** e selecione esse repositório
4. Deixe as configurações padrão e clique em **Deploy**

### 4. Configure a chave de API na Vercel (passo mais importante)
1. No painel do seu projeto na Vercel, vá em **Settings → Environment Variables**
2. Adicione uma variável:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: a chave que você copiou no passo 1
3. Clique em **Save**
4. Vá em **Deployments** e clique em **Redeploy** (para a variável entrar em vigor)

### 5. Pronto
Depois do redeploy, o chat vai funcionar no seu domínio da Vercel
(algo como `sala-do-empreendedor.vercel.app`), chamando `/api/chat`, que
por sua vez chama o Gemini com a chave guardada em segredo — de graça.

## Importante

- **Dentro do preview do Claude**, o chat continua funcionando sozinho (sem esse
  backend), porque o próprio Claude cuida da autenticação ali.
- **Fora do Claude**, o chat só funciona depois que você publicar com esse
  backend configurado — sem isso, o botão do chat aparece, mas as mensagens
  vão dar erro de conexão.
- O front-end (`sala-do-empreendedor.jsx`) não precisa de nenhuma alteração:
  o `api/chat.js` já devolve a resposta no formato que ele espera.
- O tier gratuito do Gemini é generoso, mas tem limite diário de requisições.
  Se ultrapassar, os visitantes recebem uma mensagem de erro amigável até o
  limite renovar (normalmente no dia seguinte). Acompanhe o uso em
  https://aistudio.google.com

