# 📋 Histórico Completo do Deploy - Golden Veicular

**Data**: 11 de Outubro de 2025  
**Projeto**: Sistema de Consultas Veiculares  
**Status**: ✅ Deploy Completo e Funcional

---

## 🎯 Objetivo

Fazer deploy do projeto Golden Veicular para testes remotos usando:
- **Frontend**: Vercel
- **Backend**: Railway
- **Banco de Dados**: Railway MySQL

---

## 📊 Arquitetura Final

```
┌─────────────────────────────────────────┐
│         VERCEL (Frontend)               │
│    https://golden-veicular.vercel.app   │
└──────────────┬──────────────────────────┘
               │
               │ API calls (VITE_API_URL)
               ▼
┌─────────────────────────────────────────┐
│    RAILWAY (Backend + MySQL)            │
│                                         │
│  ┌─────────────┐    ┌──────────────┐   │
│  │  Backend    │───▶│    MySQL     │   │
│  │  Node.js    │    │   Database   │   │
│  │  (Express)  │    │   railway    │   │
│  └─────────────┘    └──────────────┘   │
│                                         │
│  Backend URL:                           │
│  https://golden-veicular-production     │
│         .up.railway.app                 │
└─────────────────────────────────────────┘
```

---

## 🗄️ PASSO 1: Configuração do Banco de Dados (Railway MySQL)

### 1.1. Criação do Banco
- Acessou Railway Dashboard
- Criou novo projeto
- Provisionou MySQL
- Obteve credenciais:
  - **Host**: `mysql.railway.internal`
  - **Port**: `3306`
  - **User**: `root`
  - **Password**: `PubbMxHFqwCoWkWGbMgFEnAILQEvTkzW`
  - **Database**: `railway`

### 1.2. Conexão via MySQL Workbench
- Configurou nova conexão no Workbench
- Testou conectividade
- Conectou com sucesso

### 1.3. Scripts SQL Executados (em ordem)

#### Script 1: `RAILWAY_SCRIPT_1_BASE.sql`
- Criou tabela `users`
- Criou tabela `password_resets`
- Inseriu usuário admin (senha: admin123)

#### Script 2: `RAILWAY_SCRIPT_2_RECHARGE_PLANS.sql`
- Criou tabela `recharge_plans`
- Inseriu 4 planos padrão (Básico, Intermediário, Avançado, Premium)

#### Script 3: `RAILWAY_SCRIPT_3_PAYMENT_TABLES.sql`
- Criou tabela `payment_transactions`
- Criou tabela `webhook_logs`

#### Script 4: `RAILWAY_SCRIPT_4_CONSULTATIONS.sql`
- Criou tabela `consultation_types`
- Inseriu 17 tipos de consultas veiculares

#### Script 5: `ADD_MISSING_COLUMNS.sql` (correção)
- Adicionou coluna `balance` na tabela `users`
- Adicionou coluna `company` na tabela `users`
- Atualizou saldo do admin para 1000 créditos

### 1.4. Estrutura Final do Banco

**Tabelas criadas**:
- `users` (id, name, email, password, document_type, document_number, phone, role, balance, company, created_at)
- `password_resets`
- `recharge_plans`
- `payment_transactions`
- `webhook_logs`
- `consultation_types`

---

## 🖥️ PASSO 2: Deploy do Backend (Railway)

### 2.1. Preparação do Código
- Código já estava no GitHub: `agenciadipixel/golden-veicular`
- Executou `npm install` no backend para atualizar `package-lock.json`
- Fez commit e push das alterações

### 2.2. Configuração do Serviço Railway

**Settings**:
- **Source Repo**: `agenciadipixel/golden-veicular`
- **Branch**: `main`
- **Root Directory**: `backend`
- **Build Command**: (automático - npm install)
- **Start Command**: `npm run start`
- **Runtime**: Node.js (detectado automaticamente)

### 2.3. Variáveis de Ambiente

Configuradas via Raw Editor:

```env
DB_HOST=mysql.railway.internal
DB_PORT=3306
DB_USER=root
DB_PASSWORD=PubbMxHFqwCoWkWGbMgFEnAILQEvTkzW
DB_NAME=railway
PORT=3001
JWT_SECRET=golden_veicular_jwt_secret_2025_super_seguro_123456789
FRONTEND_URL=https://golden-veicular.vercel.app
API_ACCESS_KEY=jDvvY1lNjQs9usyimnO8w55kYToIW8bqumiQBrO0cQbir8CLKFehYYxDD/YL2acH
ASAAS_API_KEY=$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmMxMjg2MjNkLTYyYWYtNDFkZC1hZTgzLWY1MDg0NjBhNWZhMzo6JGFhY2hfZTg3OTg1OTktYzg5ZS00Y2E5LWEyZTEtYjcxY2M2MTE1ZjM2
ASAAS_ENV=sandbox
WEBHOOK_URL=https://golden-veicular.vercel.app/api/payments/webhook
```

### 2.4. Domínio Público
- Gerou domínio público: `https://golden-veicular-production.up.railway.app`
- Testou endpoint raiz: retornou `{"message":"API Golden Veicular está no ar!"}`

### 2.5. Problemas Encontrados e Soluções

**Problema 1**: Erro `npm ci` no build
- **Causa**: `package-lock.json` desatualizado
- **Solução**: Executou `npm install` localmente e fez push

**Problema 2**: Erro de conexão com MySQL (ECONNREFUSED 127.0.0.1:3306)
- **Causa**: Variáveis de ambiente não aplicadas
- **Solução**: Reconfigurou variáveis via Raw Editor

**Problema 3**: Erro "Unknown column 'balance' in 'field list'"
- **Causa**: Tabela `users` sem colunas `balance` e `company`
- **Solução**: Executou script SQL para adicionar colunas faltantes

---

## 🌐 PASSO 3: Deploy do Frontend (Vercel)

### 3.1. Configuração do Projeto

**Import Settings**:
- **Repository**: `agenciadipixel/golden-veicular`
- **Framework Preset**: Vite
- **Root Directory**: `./` (raiz)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3.2. Variável de Ambiente

Adicionada antes do deploy:

```env
VITE_API_URL=https://golden-veicular-production.up.railway.app/api
```

### 3.3. Deploy
- Build executado com sucesso (2-3 minutos)
- URL gerada: `https://golden-veicular.vercel.app`
- Tela de login renderizada corretamente

---

## 🔧 PASSO 4: Ajustes Finais e Testes

### 4.1. Atualização de CORS
- Variáveis `FRONTEND_URL` e `WEBHOOK_URL` já estavam corretas no Railway
- Backend configurado para aceitar requisições do Vercel

### 4.2. Correção do Banco de Dados
- Adicionou colunas `balance` e `company` na tabela `users`
- Atualizou saldo do admin para 1000 créditos

### 4.3. Teste de Login
- Acessou `https://golden-veicular.vercel.app`
- Login com `admin@goldenveicular.com.br` / `admin123`
- ✅ Login bem-sucedido
- ✅ Dashboard carregado
- ✅ Sistema totalmente funcional

---

## 📁 Arquivos Criados Durante o Deploy

### Scripts SQL
- `backend/RAILWAY_SCRIPT_1_BASE.sql`
- `backend/RAILWAY_SCRIPT_2_RECHARGE_PLANS.sql`
- `backend/RAILWAY_SCRIPT_3_PAYMENT_TABLES.sql`
- `backend/RAILWAY_SCRIPT_4_CONSULTATIONS.sql`
- `backend/RAILWAY_SCRIPT_5_VALIDACAO.sql`
- `backend/ADD_MISSING_COLUMNS.sql`

### Documentação
- `DEPLOY_GUIDE.md` - Guia completo de deploy
- `backend/railway.json` - Configuração Railway

---

## 🔐 Credenciais de Acesso

### Usuário Admin
- **Email**: `admin@goldenveicular.com.br`
- **Senha**: `admin123`
- **Saldo Inicial**: 1000 créditos
- **Role**: admin

### Railway MySQL
- **Host**: `mysql.railway.internal` (interno) ou via URL pública
- **Port**: `3306`
- **User**: `root`
- **Password**: `PubbMxHFqwCoWkWGbMgFEnAILQEvTkzW`
- **Database**: `railway`

---

## 🌐 URLs do Sistema

### Produção
- **Frontend**: https://golden-veicular.vercel.app
- **Backend API**: https://golden-veicular-production.up.railway.app
- **Health Check**: https://golden-veicular-production.up.railway.app (retorna JSON)

### Dashboards
- **Vercel**: https://vercel.com/dashboard
- **Railway**: https://railway.app/dashboard

---

## 📊 Estrutura de Pastas do Projeto

```
goldenveicular/
├── backend/                          # Backend Node.js + Express
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                # Configuração MySQL
│   │   ├── middleware/
│   │   │   └── auth.js              # Middleware JWT
│   │   ├── routes/                  # Rotas da API
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── consultations.js
│   │   │   ├── payments.js
│   │   │   └── ...
│   │   ├── services/
│   │   │   └── asaas.js             # Integração Asaas
│   │   └── server.js                # Servidor Express
│   ├── public/                      # Arquivos estáticos
│   ├── package.json
│   ├── .env.example
│   ├── .env.production
│   └── railway.json                 # Config Railway
│
├── src/                             # Frontend React + TypeScript
│   ├── components/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── common/
│   │   └── user/
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── services/
│   │   └── api.js                   # Cliente Axios
│   └── index.css
│
├── pages/                           # Páginas React
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Admin.tsx
│   └── ...
│
├── public/                          # Assets públicos
│   └── logo-golden-veicular-*.png
│
├── package.json                     # Dependências frontend
├── vite.config.ts                   # Config Vite
├── vercel.json                      # Config Vercel
├── DEPLOY_GUIDE.md                  # Guia de deploy
└── HISTORICO_DEPLOY.md              # Este arquivo
```

---

## 🐛 Problemas Comuns e Soluções

### Erro: "ECONNREFUSED ::1:3306"
- **Causa**: Node.js tentando conectar via IPv6
- **Solução**: Adicionar `family: 4` no `db.js` (já implementado)

### Erro: "Unknown column 'balance'"
- **Causa**: Coluna faltante na tabela users
- **Solução**: Executar `ADD_MISSING_COLUMNS.sql`

### Erro: CORS blocked
- **Causa**: `FRONTEND_URL` incorreta no backend
- **Solução**: Atualizar variável no Railway com URL exata do Vercel

### Erro: "npm ci" failed
- **Causa**: `package-lock.json` desatualizado
- **Solução**: Executar `npm install` localmente e fazer push

### Login não funciona (erro 500)
- **Causa**: Banco sem colunas necessárias ou variáveis erradas
- **Solução**: Verificar logs do Railway e estrutura do banco

---

## 🔄 Processo de Atualização

### Para Atualizar o Frontend
1. Fazer alterações no código
2. Commit e push para o GitHub (branch `main`)
3. Vercel faz deploy automático
4. Verificar em: https://golden-veicular.vercel.app

### Para Atualizar o Backend
1. Fazer alterações no código do backend
2. Commit e push para o GitHub (branch `main`)
3. Railway faz deploy automático
4. Verificar logs no Railway Dashboard

### Para Atualizar o Banco de Dados
1. Conectar via MySQL Workbench
2. Executar scripts SQL necessários
3. Verificar alterações com `DESCRIBE <tabela>`

---

## 📈 Monitoramento

### Logs do Backend (Railway)
1. Acessar Railway Dashboard
2. Clicar no serviço `golden-veicular`
3. Aba "Deployments" → Deploy ativo → "View logs"
4. Logs em tempo real

### Logs do Frontend (Vercel)
1. Acessar Vercel Dashboard
2. Selecionar projeto `golden-veicular`
3. Aba "Deployments" → Deploy ativo
4. "Build Logs" ou "Runtime Logs"

### Banco de Dados
- Conectar via MySQL Workbench
- Executar queries de diagnóstico
- Verificar tabelas e dados

---

## 🚀 Próximos Passos Sugeridos

### Segurança
- [ ] Alterar senha do admin
- [ ] Gerar novo `JWT_SECRET` mais seguro
- [ ] Configurar rate limiting na API
- [ ] Adicionar HTTPS obrigatório

### Funcionalidades
- [ ] Testar todas as 17 consultas veiculares
- [ ] Testar sistema de pagamento (Asaas sandbox)
- [ ] Testar recarga de créditos
- [ ] Criar usuários de teste

### Infraestrutura
- [ ] Configurar domínio personalizado
- [ ] Configurar backups automáticos do banco
- [ ] Configurar alertas de erro (Sentry, etc.)
- [ ] Adicionar monitoramento de uptime

### Documentação
- [ ] Documentar API (Swagger/OpenAPI)
- [ ] Criar manual do usuário
- [ ] Documentar fluxos de pagamento

---

## 📞 Informações de Suporte

### Plataformas
- **Railway**: https://railway.app/dashboard
- **Vercel**: https://vercel.com/dashboard
- **GitHub**: https://github.com/agenciadipixel/golden-veicular

### Documentação Oficial
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Vite Docs: https://vitejs.dev
- Express Docs: https://expressjs.com

---

## ✅ Checklist de Deploy Completo

- [x] Banco de dados MySQL criado no Railway
- [x] Tabelas criadas e populadas
- [x] Backend deployado no Railway
- [x] Variáveis de ambiente configuradas
- [x] Domínio público gerado para backend
- [x] Frontend deployado no Vercel
- [x] Variável VITE_API_URL configurada
- [x] CORS configurado corretamente
- [x] Login funcionando
- [x] Dashboard acessível
- [x] Sistema 100% operacional

---

## 📝 Notas Finais

- **Data de Conclusão**: 11 de Outubro de 2025, 13:58
- **Tempo Total**: ~2 horas
- **Status**: ✅ Sistema em produção e funcional
- **Ambiente**: Produção (Railway + Vercel)
- **Modo de Pagamento**: Sandbox (Asaas)

**Sistema pronto para testes remotos pelos clientes!** 🎉

---

*Documento gerado automaticamente durante o processo de deploy.*
