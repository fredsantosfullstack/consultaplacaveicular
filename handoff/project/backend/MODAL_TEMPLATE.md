# 🎨 Template do Modal de Saldo Insuficiente

## ✅ Página Atualizada:
- Base Estadual ✅

## 📋 Páginas Pendentes:
- Base Nacional
- Gravame V2
- Código de segurança PDF
- CSV - RENAINF - RENAJUD - RECALL - BIN - PROPRIETAR

---

## 🔧 Como Aplicar o Modal nas Outras Páginas:

### 1. **Adicionar CSS do Modal** (antes de `</style>`)

```css
/* Modal de Saldo Insuficiente */
.modal-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 9999;
    justify-content: center;
    align-items: center;
    animation: fadeIn 0.3s ease;
}
.modal-overlay.active {
    display: flex;
}
.modal-content {
    background: white;
    border-radius: 16px;
    padding: 40px;
    max-width: 450px;
    width: 90%;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    text-align: center;
    animation: slideUp 0.3s ease;
}
.modal-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
    border-radius: 50%;
    background-color: #fee;
    display: flex;
    align-items: center;
    justify-content: center;
}
.modal-icon svg {
    width: 50px;
    height: 50px;
    stroke: #dc3545;
    stroke-width: 2;
}
.modal-title {
    font-size: 24px;
    font-weight: 700;
    color: #333;
    margin-bottom: 12px;
}
.modal-message {
    font-size: 15px;
    color: #666;
    margin-bottom: 25px;
    line-height: 1.6;
}
.modal-balance-info {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 25px;
}
.modal-balance-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 14px;
}
.modal-balance-row:last-child {
    margin-bottom: 0;
    padding-top: 10px;
    border-top: 2px dashed #ddd;
    font-weight: 700;
    color: #dc3545;
}
.modal-balance-label {
    color: #666;
}
.modal-balance-value {
    color: #076AC2;
    font-weight: 600;
}
.modal-buttons {
    display: flex;
    gap: 12px;
}
.modal-btn {
    flex: 1;
    padding: 14px 24px;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}
.modal-btn-primary {
    background-color: #076AC2;
    color: white;
}
.modal-btn-primary:hover {
    background-color: #055a9f;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(5, 90, 159, 0.3);
}
.modal-btn-secondary {
    background-color: #e9ecef;
    color: #333;
}
.modal-btn-secondary:hover {
    background-color: #dee2e6;
}
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
@keyframes slideUp {
    from { 
        opacity: 0;
        transform: translateY(30px);
    }
    to { 
        opacity: 1;
        transform: translateY(0);
    }
}
```

---

### 2. **Adicionar HTML do Modal** (antes de `<script>`)

```html
<!-- Modal de Saldo Insuficiente -->
<div class="modal-overlay" id="modalSaldoInsuficiente">
    <div class="modal-content">
        <div class="modal-icon">
            <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
        </div>
        <h2 class="modal-title">Saldo Insuficiente</h2>
        <p class="modal-message">Você não possui créditos suficientes para realizar esta consulta.</p>
        
        <div class="modal-balance-info">
            <div class="modal-balance-row">
                <span class="modal-balance-label">Saldo atual:</span>
                <span class="modal-balance-value" id="modalSaldoAtual">R$ 0,00</span>
            </div>
            <div class="modal-balance-row">
                <span class="modal-balance-label">Valor da consulta:</span>
                <span class="modal-balance-value" id="modalValorConsulta">R$ 0,00</span>
            </div>
            <div class="modal-balance-row">
                <span class="modal-balance-label">Faltam:</span>
                <span class="modal-balance-value" id="modalFaltam">R$ 0,00</span>
            </div>
        </div>
        
        <div class="modal-buttons">
            <button class="modal-btn modal-btn-secondary" onclick="fecharModal()">Cancelar</button>
            <button class="modal-btn modal-btn-primary" onclick="irParaRecarga()">Recarregar Créditos</button>
        </div>
    </div>
</div>
```

---

### 3. **Adicionar Funções JavaScript** (no início do `<script>`)

```javascript
// Funções do Modal
function mostrarModal(saldoAtual, valorConsulta) {
    const faltam = valorConsulta - saldoAtual;
    document.getElementById('modalSaldoAtual').textContent = `R$ ${saldoAtual.toFixed(2)}`;
    document.getElementById('modalValorConsulta').textContent = `R$ ${valorConsulta.toFixed(2)}`;
    document.getElementById('modalFaltam').textContent = `R$ ${faltam.toFixed(2)}`;
    document.getElementById('modalSaldoInsuficiente').classList.add('active');
}

function fecharModal() {
    document.getElementById('modalSaldoInsuficiente').classList.remove('active');
}

function irParaRecarga() {
    window.location.href = 'http://localhost:5174/credit-recharge';
}

// Fechar modal ao clicar fora
document.getElementById('modalSaldoInsuficiente').addEventListener('click', function(e) {
    if (e.target === this) {
        fecharModal();
    }
});
```

---

### 4. **Substituir o Tratamento de Erro 402**

**ANTES:**
```javascript
if (response.status === 402) {
    const errorData = await response.json();
    message.className = 'message error';
    message.innerHTML = `${errorData.msg}<br><br>Saldo atual: R$ ${errorData.balance.toFixed(2)}<br>Valor necessário: R$ ${errorData.required.toFixed(2)}<br><br><a href="http://localhost:5174/credit-recharge" style="color: #076AC2; font-weight: bold;">Clique aqui para recarregar</a>`;
    message.style.display = 'block';
}
```

**DEPOIS:**
```javascript
if (response.status === 402) {
    // Saldo insuficiente - Mostrar Modal
    const errorData = await response.json();
    mostrarModal(errorData.balance, errorData.required);
}
```

---

## 🎯 Resultado Final:

Quando o usuário tentar fazer uma consulta sem saldo suficiente:
1. ✅ Modal bonito aparece com animação
2. ✅ Mostra saldo atual, valor necessário e quanto falta
3. ✅ Botão "Recarregar Créditos" redireciona para a página de recarga
4. ✅ Botão "Cancelar" fecha o modal
5. ✅ Clicar fora do modal também fecha

---

## 🚀 Próximos Passos:

Aplique essas mudanças nas 4 páginas restantes:
- `base-nacional.html`
- `gravame-v2.html`
- `codigo-seguranca-pdf.html`
- `csv-renainf-renajud-recall-bin-proprietar.html`
