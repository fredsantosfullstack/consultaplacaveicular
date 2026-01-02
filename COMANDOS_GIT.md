# 📝 Comandos Git - Passo a Passo

## ✅ Pré-requisitos
- Ter uma conta no GitHub (https://github.com)
- Git instalado (já vem com o Windsurf)

---

## 🚀 Passo 1: Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. **Nome do repositório:** `consultaplacaveicular`
3. **Descrição:** Plataforma de consultas veiculares com CMS integrado
4. **Visibilidade:** ✅ Private (recomendado para proteger seu código)
5. **NÃO marque:** "Add a README file" (já temos um)
6. Clique em **"Create repository"**

---

## 🔧 Passo 2: Executar Comandos no Terminal

Abra o terminal do Windsurf (Ctrl + `) e execute os comandos abaixo:

### **1. Inicializar Git (se ainda não foi feito)**
```bash
git init
```

### **2. Adicionar todos os arquivos**
```bash
git add .
```

### **3. Fazer o primeiro commit**
```bash
git commit -m "Initial commit - Plataforma de consultas veiculares completa"
```

### **4. Renomear branch para main**
```bash
git branch -M main
```

### **5. Adicionar repositório remoto**
**⚠️ IMPORTANTE:** Substitua `SEU-USUARIO` pelo seu nome de usuário do GitHub!

```bash
git remote add origin https://github.com/SEU-USUARIO/consultaplacaveicular.git
```

### **6. Fazer push para o GitHub**
```bash
git push -u origin main
```

**Nota:** Você será solicitado a fazer login no GitHub. Use suas credenciais.

---

## ✅ Verificar se Funcionou

1. Acesse: `https://github.com/SEU-USUARIO/consultaplacaveicular`
2. Você deve ver todos os arquivos do projeto
3. O README.md será exibido automaticamente

---

## 📌 Comandos Futuros (Após Mudanças)

Sempre que fizer alterações no código:

```bash
# 1. Ver o que mudou
git status

# 2. Adicionar mudanças
git add .

# 3. Fazer commit com mensagem descritiva
git commit -m "Descrição da mudança"

# 4. Enviar para GitHub
git push
```

---

## 🔐 Segurança - Arquivos Protegidos

Os seguintes arquivos **NÃO** serão enviados ao GitHub (protegidos pelo .gitignore):

- ✅ `.env` (senhas e chaves de API)
- ✅ `node_modules/` (dependências)
- ✅ `backend/public/uploads/*` (arquivos de usuários)
- ✅ Arquivos temporários e cache

---

## 🆘 Problemas Comuns

### **Erro: "remote origin already exists"**
```bash
git remote remove origin
git remote add origin https://github.com/SEU-USUARIO/consultaplacaveicular.git
```

### **Erro: "Authentication failed"**
- Use um Personal Access Token ao invés de senha
- Gere em: https://github.com/settings/tokens
- Permissões: `repo` (acesso completo a repositórios)

### **Erro: "Updates were rejected"**
```bash
git pull origin main --rebase
git push
```

---

## 🎯 Próximo Passo

Após subir para o GitHub, você pode:
1. Conectar a Hostinger ao repositório
2. Configurar deploy automático
3. Cada `git push` fará deploy automático!

---

**Criado por:** Time de Desenvolvimento Sênior
**Data:** 02/01/2025
