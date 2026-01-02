# 🚀 Guia de Deploy - Golden Veicular

## Arquitetura do Deploy
- **Frontend**: Vercel (React + Vite)
- **Backend**: Railway (Node.js + Express)
- **Banco de Dados**: Railway MySQL

---

## 📋 Pré-requisitos
- [ ] Conta no [Vercel](https://vercel.com)
- [ ] Conta no [Railway](https://railway.app)
- [ ] Repositório Git (GitHub/GitLab/Bitbucket)
- [ ] Credenciais do MySQL Railway

---

## 🗄️ PASSO 1: Configurar MySQL no Railway

### 1.1. Criar Banco MySQL
1. Acesse [Railway Dashboard](https://railway.app/dashboard)
2. Clique em **"New Project"** → **"Provision MySQL"**
3. Aguarde o provisionamento (1-2 minutos)

### 1.2. Obter Credenciais
1. Clique no serviço MySQL criado
2. Vá em **"Variables"** ou **"Connect"**
3. Copie as seguintes informações:
   - `MYSQL_HOST` (ex: `containers-us-west-xxx.railway.app`)
   - `MYSQL_PORT` (geralmente `3306`)
   - `MYSQL_DATABASE` (ex: `railway`)
   - `MYSQL_USER` (ex: `root`)
   - `MYSQL_PASSWORD` (senha gerada)

### 1.3. Importar Estrutura do Banco
1. Conecte via MySQL Workbench ou CLI:
   ```bash
   mysql -h <MYSQL_HOST> -P <MYSQL_PORT> -u <MYSQL_USER> -p<MYSQL_PASSWORD> <MYSQL_DATABASE>
   ```

2. Execute os scripts SQL na ordem:
   ```sql
   SOURCE backend/SQL_SETUP.sql;
   SOURCE backend/CREATE_PAYMENT_TABLES.sql;
   SOURCE backend/CREATE_RECHARGE_PLANS.sql;
   SOURCE backend/INSERT_CONSULTATIONS.sql;
   SOURCE backend/UPDATE_ADMIN_PASSWORD.sql;
   ```

---

## 🔧 PASSO 2: Deploy do Backend no Railway

### 2.1. Criar Serviço Node.js
1. No mesmo projeto Railway, clique **"New Service"** → **"GitHub Repo"**
2. Conecte seu repositório e selecione o branch principal
3. Railway detectará automaticamente o Node.js

### 2.2. Configurar Root Directory
1. Clique no serviço criado → **"Settings"**
2. Em **"Root Directory"**, defina: `backend`
3. Em **"Start Command"**, confirme: `npm run start`

### 2.3. Configurar Variáveis de Ambiente
1. Vá em **"Variables"** do serviço backend
2. Adicione as seguintes variáveis (use os valores do MySQL criado):

```env
DB_HOST=<MYSQL_HOST do passo 1.2>
DB_USER=<MYSQL_USER do passo 1.2>
DB_PASSWORD=<MYSQL_PASSWORD do passo 1.2>
DB_NAME=<MYSQL_DATABASE do passo 1.2>
PORT=3001
JWT_SECRET=golden_veicular_jwt_secret_2025_super_seguro_123456789
FRONTEND_URL=https://seu-app.vercel.app
API_ACCESS_KEY=jDvvY1lNjQs9usyimnO8w55kYToIW8bqumiQBrO0cQbir8CLKFehYYxDD/YL2acH
ASAAS_API_KEY=$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmMxMjg2MjNkLTYyYWYtNDFkZC1hZTgzLWY1MDg0NjBhNWZhMzo6JGFhY2hfZTg3OTg1OTktYzg5ZS00Y2E5LWEyZTEtYjcxY2M2MTE1ZjM2
ASAAS_ENV=sandbox
WEBHOOK_URL=https://seu-app.vercel.app/api/payments/webhook
```

⚠️ **IMPORTANTE**: Substitua `https://seu-app.vercel.app` pela URL real do Vercel (passo 3)

### 2.4. Deploy
1. Clique em **"Deploy"** ou aguarde o deploy automático
2. Após conclusão, copie a URL pública (ex: `https://golden-backend-production.up.railway.app`)
3. Teste acessando: `https://sua-url-railway.app` (deve retornar `{"message": "API Golden Veicular está no ar!"}`)

---

## 🌐 PASSO 3: Deploy do Frontend no Vercel

### 3.1. Conectar Repositório
1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Clique em **"Add New"** → **"Project"**
3. Importe o repositório do GitHub
4. Selecione o branch principal

### 3.2. Configurar Build
1. **Framework Preset**: Vite
2. **Root Directory**: `.` (raiz do projeto)
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`

### 3.3. Configurar Variável de Ambiente
1. Em **"Environment Variables"**, adicione:
   ```
   VITE_API_URL=https://sua-url-railway.app/api
   ```
   ⚠️ Use a URL do Railway do passo 2.4 + `/api`

### 3.4. Deploy
1. Clique em **"Deploy"**
2. Aguarde o build (2-3 minutos)
3. Copie a URL gerada (ex: `https://golden-veicular.vercel.app`)

### 3.5. Atualizar CORS no Backend
1. Volte ao Railway → Serviço Backend → **"Variables"**
2. Atualize `FRONTEND_URL` com a URL do Vercel
3. Atualize `WEBHOOK_URL` com `https://sua-url-vercel.app/api/payments/webhook`
4. Clique em **"Redeploy"**

---

## ✅ PASSO 4: Validação

### 4.1. Testar Backend
```bash
curl https://sua-url-railway.app
# Deve retornar: {"message": "API Golden Veicular está no ar!"}
```

### 4.2. Testar Frontend
1. Acesse `https://sua-url-vercel.app`
2. Tente fazer login com:
   - Email: `admin@goldenveicular.com.br`
   - Senha: `admin123`

### 4.3. Testar Integração
1. Após login, acesse o Dashboard
2. Verifique se os dados carregam corretamente
3. Teste uma consulta simples

---

## 🔄 Atualizações Futuras

### Frontend (Vercel)
- Push para o branch principal → Deploy automático

### Backend (Railway)
- Push para o branch principal → Deploy automático
- Ou clique em **"Redeploy"** no painel Railway

---

## 🐛 Troubleshooting

### Erro de CORS
- Verifique se `FRONTEND_URL` no Railway está correto
- Deve ser a URL exata do Vercel (sem barra final)

### Erro de Conexão com Banco
- Confirme as credenciais MySQL no Railway
- Verifique se o serviço MySQL está rodando
- Teste conexão via MySQL Workbench

### Build Falhou no Vercel
- Verifique se `VITE_API_URL` está configurado
- Confirme que `npm run build` funciona localmente

### Backend não inicia
- Verifique logs no Railway Dashboard
- Confirme que todas as variáveis de ambiente estão definidas
- Verifique se o Root Directory está como `backend`

---

## 📞 Suporte

Em caso de dúvidas, verifique:
- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Railway](https://docs.railway.app)
- Logs de deploy em ambas plataformas
