# 🚗 Consulta Placa Veicular

Plataforma completa de consultas veiculares com sistema de créditos, pagamentos via PIX/Cartão (Mercado Pago) e CMS integrado para gerenciamento de conteúdo.

## ✨ Funcionalidades Principais

### 🌐 **Landing Page Customizável**
- Editor visual completo (Site Builder)
- Seções: Hero, Serviços, Como Funciona, Contato
- Upload de logo e favicon
- Configuração de SEO (título, descrição, keywords)
- Cores personalizáveis
- Menu scroll suave
- Botão WhatsApp integrado
- 100% Responsivo (mobile-first)

### 🔐 **Sistema de Autenticação**
- Login e cadastro de usuários
- Recuperação de senha
- JWT com refresh tokens
- Proteção de rotas
- Níveis de acesso (Admin/Usuário)

### 🚗 **Consultas Veiculares**
- Busca por Placa, Chassi, RENAVAM
- Histórico completo de consultas
- Download de relatórios em PDF
- Sistema de créditos
- Integração com API Portal Despachantes

### 💳 **Sistema de Pagamentos**
- Recarga de créditos via PIX (QR Code)
- Integração Mercado Pago
- Webhook automático para confirmação
- Histórico de transações
- Múltiplos planos de recarga

### 📊 **Painel Administrativo**
- Dashboard com métricas em tempo real
- Gerenciamento de usuários
- Gerenciamento de planos de recarga
- Site Builder (CMS completo)
- Configurações do site
- Relatórios e estatísticas
- Tabela de preços pública

## 🛠️ Stack Tecnológico

### **Frontend**
- React 19 (Concurrent Features)
- TypeScript
- Vite (Build Tool)
- TailwindCSS (Styling)
- React Router v6 (SPA Navigation)
- Lucide React (Icons)
- Axios (HTTP Client)

### **Backend**
- Node.js 20 LTS
- Express.js (REST API)
- MySQL 8.0 (Database)
- JWT (Authentication)
- Multer (File Upload)
- Nodemailer (Email)
- Bcrypt (Password Hashing)

### **Integrações**
- Mercado Pago (Pagamentos PIX)
- Portal Despachantes (Consultas Veiculares)

### **Deploy**
- Hostinger Agentic Deployment
- GitHub (Version Control)
- PM2 (Process Manager)

## 🚀 Instalação e Configuração

### **Pré-requisitos**
- Node.js 18+ e npm
- MySQL 8.0+
- Git

### **1. Clone o Repositório**
```bash
git clone https://github.com/seu-usuario/consultaplacaveicular.git
cd consultaplacaveicular
```

### **2. Configurar Backend**
```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais

# Criar banco de dados
mysql -u root -p
CREATE DATABASE consultaplacaveicular;
exit;

# Executar migrations
npm run migrate

# Iniciar servidor de desenvolvimento
npm run dev
```

### **3. Configurar Frontend**
```bash
cd ..

# Instalar dependências
npm install

# Iniciar aplicação
npm run dev
```

### **4. Acessar Aplicação**
- Frontend: http://localhost:5174
- Backend API: http://localhost:3001

### **5. Credenciais Padrão**
- **Admin:** `admin@admin.com` / `admin123`

## 📁 Estrutura do Projeto

```
consultaplacaveicular/
├── backend/                    # Backend Node.js
│   ├── src/
│   │   ├── routes/            # Rotas da API
│   │   ├── controllers/       # Controladores
│   │   ├── services/          # Lógica de negócio
│   │   ├── middleware/        # Middlewares
│   │   └── config/            # Configurações
│   ├── migrations/            # Migrations SQL
│   ├── public/uploads/        # Arquivos enviados
│   └── .env                   # Variáveis de ambiente
│
├── src/                       # Frontend React
│   ├── pages/                 # Páginas
│   ├── components/            # Componentes reutilizáveis
│   ├── contexts/              # Context API
│   ├── services/              # Serviços (API calls)
│   └── layouts/               # Layouts
│
├── public/                    # Arquivos estáticos
└── package.json               # Dependências frontend
```

## 🔧 Variáveis de Ambiente

### **Backend (.env)**
```env
# Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=consultaplacaveicular

# JWT
JWT_SECRET=seu_segredo_jwt_aqui

# URLs
FRONTEND_URL=http://localhost:5174
BACKEND_URL=http://localhost:3001

# Mercado Pago
MERCADO_PAGO_ACCESS_TOKEN=seu_access_token

# API Externa
API_ACCESS_KEY=sua_chave_api
```

## 🚀 Deploy na Hostinger

### **1. Preparar Projeto**
```bash
# Build do frontend
npm run build

# Build do backend (se necessário)
cd backend
npm install --production
```

### **2. Conectar GitHub**
- Crie repositório no GitHub
- Push do código
- Conecte Hostinger ao repositório

### **3. Configurar Variáveis de Ambiente**
- No painel da Hostinger, adicione todas as variáveis do .env
- Configure URL de produção

### **4. Deploy Automático**
- Cada push no GitHub faz deploy automático

## 📊 Banco de Dados

### **Migrations**
```bash
# Executar todas as migrations
cd backend
node migrations/run_migration.js

# Ou executar SQL manualmente no phpMyAdmin
```

### **Tabelas Principais**
- `users` - Usuários do sistema
- `recharge_plans` - Planos de recarga
- `payment_transactions` - Transações de pagamento
- `vehicle_queries` - Consultas realizadas
- `site_settings` - Configurações do site
- `site_*` - Tabelas do CMS

## 🔐 Segurança

- ✅ Senhas hasheadas com bcrypt
- ✅ JWT com tokens de acesso e refresh
- ✅ Proteção contra SQL Injection
- ✅ Sanitização de inputs
- ✅ CORS configurado
- ✅ Rate limiting
- ✅ HTTPS obrigatório em produção

## 📝 Scripts Disponíveis

### **Frontend**
```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Linter
```

### **Backend**
```bash
npm run dev          # Desenvolvimento (nodemon)
npm start            # Produção
npm run migrate      # Executar migrations
```

## 🤝 Contribuindo

Este é um projeto proprietário. Para contribuir, entre em contato com a equipe.

## License

Projeto proprietário - Consulta Placa Veicular © 2025

## 📞 Suporte

Para suporte técnico, entre em contato através do painel administrativo.
