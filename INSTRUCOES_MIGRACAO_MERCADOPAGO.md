# Instruções para Migração de Asaas para Mercado Pago

## ✅ Etapas Concluídas

1. ✅ Serviço Mercado Pago criado (`backend/src/services/mercadopago.js`)
2. ✅ Rotas de pagamento atualizadas (`backend/src/routes/payments.js`)
3. ✅ Painel admin atualizado com campos do Mercado Pago (`src/components/admin/SiteSettings.tsx`)

## 📋 Próximas Etapas (Execute Manualmente)

### 1. Atualizar Banco de Dados

Execute o script SQL no phpMyAdmin ou MySQL Workbench:

```sql
-- 1. Adicionar colunas do Mercado Pago na tabela payment_transactions
ALTER TABLE payment_transactions 
ADD COLUMN mp_preference_id VARCHAR(255) NULL AFTER asaas_payment_id,
ADD COLUMN mp_payment_id VARCHAR(255) NULL AFTER mp_preference_id;

-- 2. Adicionar índices para melhor performance
ALTER TABLE payment_transactions 
ADD INDEX idx_mp_preference_id (mp_preference_id),
ADD INDEX idx_mp_payment_id (mp_payment_id);

-- 3. Adicionar configuração do Mercado Pago na tabela site_settings
INSERT INTO site_settings (setting_key, setting_value, created_at, updated_at)
VALUES ('mercado_pago_access_token', '', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();
```

### 2. Configurar Mercado Pago no Painel Admin

1. Acesse o painel admin
2. Vá em **Configurações do Site**
3. Role até a seção **Mercado Pago**
4. Insira seu **Access Token** do Mercado Pago
   - Obtenha em: https://www.mercadopago.com.br/developers/panel/credentials
5. Clique em **Salvar Credenciais**

### 3. Remover Arquivo Asaas (Opcional)

Após confirmar que tudo está funcionando:

```bash
# Remover serviço Asaas
rm backend/src/services/asaas.js
```

### 4. Atualizar Variáveis de Ambiente (se necessário)

No arquivo `.env` do backend, você pode remover as variáveis do Asaas:

```env
# Remover estas linhas (OPCIONAL - após confirmar funcionamento)
# ASAAS_API_KEY=...
# ASAAS_ENV=...
```

## 🔧 Como Funciona a Nova Integração

### Fluxo de Pagamento

1. **Usuário seleciona plano** → Frontend chama `/payments/create-charge`
2. **Backend cria preferência** → Mercado Pago retorna `init_point` (link de pagamento)
3. **Usuário é redirecionado** → Para página de pagamento do Mercado Pago
4. **Pagamento aprovado** → Mercado Pago envia webhook para `/payments/webhook`
5. **Créditos adicionados** → Sistema adiciona créditos automaticamente

### Webhook do Mercado Pago

O webhook está configurado em: `http://localhost:3001/payments/webhook`

**IMPORTANTE:** Em produção, configure a URL do webhook no painel do Mercado Pago:
- Acesse: https://www.mercadopago.com.br/developers/panel/webhooks
- Configure: `https://seu-dominio.com.br/payments/webhook`

## 📊 Diferenças entre Asaas e Mercado Pago

| Recurso | Asaas | Mercado Pago |
|---------|-------|--------------|
| Método de Pagamento | PIX direto com QR Code | Checkout com múltiplas opções |
| Integração | API REST | Preferências de Pagamento |
| Webhook | Eventos específicos | Notificações IPN |
| Identificador | `asaas_payment_id` | `mp_preference_id` + `mp_payment_id` |

## 🧪 Testar a Integração

1. Acesse a página de recarga de créditos
2. Selecione um plano
3. Clique em "Recarregar"
4. Você será redirecionado para o Mercado Pago
5. Use credenciais de teste (sandbox) ou reais (produção)
6. Após pagamento, verifique se os créditos foram adicionados

## 🔐 Segurança

- ✅ Access Token armazenado no banco de dados (criptografado em produção)
- ✅ Webhook valida eventos do Mercado Pago
- ⚠️ **TODO:** Implementar validação de assinatura do webhook
- ⚠️ **TODO:** Adicionar rate limiting no webhook

## 📝 Notas Importantes

- O sistema mantém compatibilidade com transações antigas do Asaas
- Novas transações usarão apenas Mercado Pago
- Logs de webhook são salvos na tabela `webhook_logs`
- Transações são salvas na tabela `payment_transactions`

## 🆘 Suporte

Em caso de problemas:
1. Verifique os logs do backend
2. Verifique a tabela `webhook_logs` no banco de dados
3. Confirme que o Access Token está correto
4. Teste em ambiente sandbox primeiro
