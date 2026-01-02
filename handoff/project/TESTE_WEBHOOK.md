# 🧪 TESTE COMPLETO DO WEBHOOK

## ✅ CHECKLIST DE VERIFICAÇÃO:

### 1. **Webhook no Asaas:**
- [ ] URL: `https://goldenveicular.com.br/api/payments/webhook`
- [ ] Status: Ativado (verde)
- [ ] Eventos: PAYMENT_RECEIVED + PAYMENT_CONFIRMED
- [ ] Fila de sincronização: Sim

### 2. **Backend (Railway):**
- [ ] Deploy está ACTIVE
- [ ] Logs mostram: "Servidor rodando na porta 3001"
- [ ] Conexão com banco: OK

### 3. **Teste de Webhook Manual:**

Acesse no navegador:
```
https://goldenveicular.com.br/api/payments/webhook
```

Deve retornar erro 404 ou "Cannot GET" (normal, pois é POST)

### 4. **Teste de Polling:**

Acesse no navegador (substitua PAYMENT_ID):
```
https://goldenveicular.com.br/api/payments/status/PAYMENT_ID
```

Deve retornar JSON com status da transação

---

## 🔧 FLUXO COMPLETO:

```
1. Cliente gera PIX
   ↓
2. Backend cria cobrança no Asaas
   ↓
3. Asaas retorna QR Code
   ↓
4. Cliente paga PIX
   ↓ (5-10 segundos)
5. Asaas envia webhook → https://goldenveicular.com.br/api/payments/webhook
   ↓
6. Backend (server.js linha 65):
   - Recebe webhook
   - Busca transação no banco
   - Adiciona crédito ao usuário
   - Atualiza status para "confirmed"
   - Retorna 200 para Asaas
   ↓
7. Frontend (polling a cada 5s):
   - Consulta: /api/payments/status/{id}
   - Detecta status "confirmed"
   - Mostra tela verde! 🟢
   ↓
8. Após 3 segundos:
   - Volta para seleção de planos
```

---

## ❌ PROBLEMAS COMUNS:

### **Problema 1: Webhook não chega**
- Verificar URL no Asaas
- Verificar se webhook está ativado
- Ver logs de webhooks no Asaas

### **Problema 2: Webhook chega mas dá erro**
- Ver logs do Railway
- Verificar se banco está conectado
- Verificar se transação existe

### **Problema 3: Polling não detecta**
- Verificar se rota /status funciona
- Ver console do navegador (F12)
- Verificar se status foi atualizado no banco

---

## 🎯 TESTE PASSO A PASSO:

1. **Adicionar R$ 5,00 manualmente no Workbench**
2. **Aguardar deploy terminar (2-3 min)**
3. **Fazer novo pagamento de R$ 5,00**
4. **Pagar o PIX**
5. **Aguardar 15 segundos SEM fechar a página**
6. **Observar:**
   - Tela deve ficar verde
   - Saldo deve atualizar
   - Deve voltar para seleção após 3s

---

## 📊 LOGS ESPERADOS:

### **Railway (Backend):**
```
🔔 WEBHOOK RECEBIDO DIRETAMENTE NO SERVER.JS!
Method: POST
Body: { event: "PAYMENT_RECEIVED", payment: {...} }
💰 Processando pagamento: pay_xxxxx
✅ Crédito adicionado com sucesso! Usuário: 2 Créditos: 5
```

### **Asaas (Webhooks):**
```
Status: 200 (verde)
URL: https://goldenveicular.com.br/api/payments/webhook
Resposta: { success: true, message: "Webhook processado com sucesso!" }
```

### **Frontend (Console do Navegador):**
```
Polling: /api/payments/status/pay_xxxxx
Response: { status: "confirmed", confirmed: true }
```
