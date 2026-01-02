# 📦 Pacote de Entrega – Golden Veicular

Este diretório reúne os itens necessários para que o novo time hospede o projeto em outro servidor. Acompanhe os passos abaixo e utilize os arquivos de apoio incluídos aqui.

## 1. Conteúdo deste diretório

- `env/backend.env.example` – modelo de variáveis para o backend.
- `env/frontend.env.example` – modelo de variáveis para o frontend.
- `INSTRUCOES_IMPLANTACAO.md` – este guia passo a passo.

O restante do código (frontend e backend) permanece nas pastas originais do repositório:

```
/
├── backend/              # API Node.js/Express + integração Asaas/MySQL
├── src/                  # Frontend React + TypeScript (App principal)
├── pages/                # Páginas React adicionais (carregadas pelo App)
├── components/           # Componentes compartilhados
├── DEPLOY_GUIDE.md       # Guia histórico de deploy (manter como referência)
└── ...
```

## 2. Pré-requisitos

- Node.js 18 ou superior.
- npm 9+ (ou pnpm/yarn se preferirem, ajustando comandos).
- Banco MySQL 8 (ou compatível) com credenciais de acesso.
- Conta Asaas com API Key (sandbox ou produção) para emissão de cobranças PIX.
- Host estático ou serviço de deploy (ex.: Vercel) para o frontend.
- Ambiente para executar o backend (ex.: VPS, Railway, Render, Docker, etc.).

## 3. Preparando variáveis de ambiente

1. Copie os arquivos modelo deste diretório:
   ```bash
   cp handoff/env/backend.env.example backend/.env
   cp handoff/env/frontend.env.example .env
   ```
2. Preencha os valores conforme o ambiente (desenvolvimento ou produção). Campos obrigatórios estão comentados nos próprios arquivos.
3. Nunca versionar `.env` preenchidos; entregar ao time novo via canal seguro.

### Variáveis obrigatórias – Backend (`backend/.env`)
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` – credenciais MySQL.
- `JWT_SECRET` – chave secreta usada na autenticação JWT.
- `PORT` – porta HTTP do backend (padrão 3001).
- `FRONTEND_URL` – URLs permitidas no CORS (separe múltiplas URLs por vírgula).
- `API_ACCESS_KEY` – chave de acesso para a API de consultas externas.
- `ASAAS_API_KEY` e `ASAAS_ENV` – credenciais do Asaas.

### Variáveis obrigatórias – Frontend (`.env` na raiz)
- `VITE_API_URL` – URL base do backend (ex.: `https://api.seudominio.com/api`).
- `VITE_WEBHOOK_URL` (opcional) – usado em telas que exibem instruções de webhook.

## 4. Banco de dados

1. Crie o schema MySQL definido em `backend/.env` (`DB_NAME`).
2. Execute os scripts SQL necessários (presentes em `backend/`):
   - Para uma instalação completa, utilize a sequência recomendada em `backend/SETUP_COMPLETO_PAGAMENTOS.sql` e demais scripts de `RAILWAY_SCRIPT_*` conforme necessidade.
   - Scripts complementares (`INSERT_RECHARGE_PLANS.sql`, `INSERT_CONSULTATIONS.sql`, etc.) devem ser aplicados para popular dados padrão.
3. Garanta que exista ao menos um usuário administrador (consultar `backend/add-new-admin.sql`).
4. Após importar os dados, teste a conexão executando `npm run dev:backend` na raiz (veja seção 5).

## 5. Backend (API Express)

1. Instale dependências na raiz e no backend:
   ```bash
   npm install
   npm install --prefix backend
   ```
2. (Opcional) Se preferir isolamento, acesse `backend/` e rode `npm install` separadamente.
3. Desenvolvimento:
   ```bash
   npm run dev:backend
   ```
   O servidor rodará na porta configurada (`PORT`, padrão 3001).
4. Produção:
   ```bash
   cd backend
   npm run start
   ```
   Ajuste o gerenciador de processos (PM2, systemd etc.) conforme infra escolhida.
5. Webhook Asaas: certifique-se de expor `POST /api/payments/webhook` publicamente e apontar o webhook no painel Asaas para esse endpoint.

## 6. Frontend (React + Vite)

1. Defina `VITE_API_URL` no `.env` da raiz (ex.: `https://api.seudominio.com/api`).
2. Desenvolvimento local:
   ```bash
   npm run dev:frontend
   ```
   Por padrão o Vite utiliza a porta 5174. O proxy já redireciona `/api` para `http://localhost:3001` (ajuste em `vite.config.ts` se necessário).
3. Build produção:
   ```bash
   npm run build
   ```
   O bundle ficará em `dist/`. Publique essa pasta em um host estático ou configure o Vercel (ver `vercel.json`).
4. Se usar o backend como servidor de arquivos estáticos, sirva `dist/` via CDN ou nginx e mantenha o backend separado.

## 7. Serviços externos

- **Asaas**: informe `ASAAS_API_KEY` e `ASAAS_ENV` (`sandbox` ou `production`). Crie/valide o webhook apontando para o backend.
- **API de consultas externas**: defina `API_ACCESS_KEY` conforme credencial fornecida pelo provedor atual.
- **SMTP** (opcional): se ativar disparo de e-mails, configure `SMTP_*` no backend `.env`.

## 8. Checklist final

- [ ] `.env` configurados (frontend e backend).
- [ ] Scripts SQL executados e dados iniciais conferidos.
- [ ] Backend em execução com logs: `✅ Conexão com o banco de dados bem-sucedida`.
- [ ] Webhook Asaas testado (`/api/payments/webhook`).
- [ ] Frontend buildado e apontando para o backend correto.
- [ ] Credenciais de acesso padrão testadas (ex.: admin).
- [ ] Documentação enviada ao time hospedeiro.

> Dica: mantenha este diretório `handoff/` junto do repositório na entrega. Assim, o novo time terá um pacote único com templates e instruções.
