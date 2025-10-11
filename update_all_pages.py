import os
import re

# CSS adicional para modais e PDF viewer
ADDITIONAL_CSS = """
        
        /* Modal de Sucesso */
        .modal-icon.success {
            background-color: #d4edda;
        }
        .modal-icon.success svg {
            stroke: #28a745;
        }
        
        /* Modal de Erro */
        .modal-icon.error {
            background-color: #f8d7da;
        }
        .modal-icon.error svg {
            stroke: #dc3545;
        }
        
        /* Visualizador de PDF */
        .pdf-viewer-container {
            display: none;
            margin-top: 30px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 12px;
        }
        .pdf-viewer-container.active {
            display: block;
        }
        .pdf-viewer-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .pdf-viewer-title {
            font-size: 18px;
            font-weight: 600;
            color: #000042;
        }
        .pdf-viewer-actions {
            display: flex;
            gap: 10px;
        }
        .btn-download {
            background-color: #28a745;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .btn-download:hover {
            background-color: #218838;
            transform: translateY(-2px);
        }
        .btn-close-pdf {
            background-color: #6c757d;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .btn-close-pdf:hover {
            background-color: #5a6268;
        }
        .pdf-iframe {
            width: 100%;
            height: 600px;
            border: 2px solid #dee2e6;
            border-radius: 8px;
            background-color: white;
        }"""

# HTML do visualizador de PDF
PDF_VIEWER_HTML = """
    <!-- Visualizador de PDF -->
    <div class="pdf-viewer-container" id="pdfViewerContainer">
        <div class="pdf-viewer-header">
            <h3 class="pdf-viewer-title">Resultado da Consulta</h3>
            <div class="pdf-viewer-actions">
                <button class="btn-download" id="btnDownloadPdf">⬇️ Download PDF</button>
                <button class="btn-close-pdf" onclick="fecharPdfViewer()">✕ Fechar</button>
            </div>
        </div>
        <iframe id="pdfIframe" class="pdf-iframe"></iframe>
    </div>
"""

# HTML dos modais
MODALS_HTML = """
    <!-- Modal de Sucesso -->
    <div class="modal-overlay" id="modalSucesso">
        <div class="modal-content">
            <div class="modal-icon success">
                <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9 12l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
            </div>
            <h2 class="modal-title">Sucesso</h2>
            <p class="modal-message">Consulta realizada com sucesso!</p>
            <div class="modal-buttons">
                <button class="modal-btn modal-btn-primary" onclick="fecharModalSucesso()">OK</button>
            </div>
        </div>
    </div>

    <!-- Modal de Erro -->
    <div class="modal-overlay" id="modalErro">
        <div class="modal-content">
            <div class="modal-icon error">
                <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
            </div>
            <h2 class="modal-title">Erro!</h2>
            <p class="modal-message" id="modalErroMensagem">Não foi possível realizar a consulta.</p>
            <div class="modal-buttons">
                <button class="modal-btn modal-btn-primary" onclick="fecharModalErro()">OK</button>
            </div>
        </div>
    </div>
"""

# JavaScript adicional
ADDITIONAL_JS = """
        // Variáveis globais
        let pdfBlobUrl = null;
        let pdfFileName = '';

        // Funções do Modal de Sucesso
        function mostrarModalSucesso() {
            document.getElementById('modalSucesso').classList.add('active');
        }

        function fecharModalSucesso() {
            document.getElementById('modalSucesso').classList.remove('active');
            // Mostra o PDF após fechar o modal
            mostrarPdfViewer();
        }

        // Funções do Modal de Erro
        function mostrarModalErro(mensagem) {
            document.getElementById('modalErroMensagem').textContent = mensagem;
            document.getElementById('modalErro').classList.add('active');
        }

        function fecharModalErro() {
            document.getElementById('modalErro').classList.remove('active');
        }

        // Funções do Visualizador de PDF
        function mostrarPdfViewer() {
            document.getElementById('pdfViewerContainer').classList.add('active');
            document.getElementById('pdfIframe').src = pdfBlobUrl;
        }

        function fecharPdfViewer() {
            document.getElementById('pdfViewerContainer').classList.remove('active');
            if (pdfBlobUrl) {
                URL.revokeObjectURL(pdfBlobUrl);
                pdfBlobUrl = null;
            }
        }

        // Função de Download
        document.getElementById('btnDownloadPdf').addEventListener('click', function() {
            const a = document.createElement('a');
            a.href = pdfBlobUrl;
            a.download = pdfFileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });

"""

def update_html_file(filepath):
    """Atualiza um arquivo HTML com as melhorias"""
    print(f"Processando: {filepath}")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pula se já foi atualizado
    if 'modalSucesso' in content:
        print(f"  ✓ Já atualizado, pulando...")
        return False
    
    # 1. Adiciona CSS antes de </style>
    content = content.replace('    </style>', ADDITIONAL_CSS + '\n    </style>')
    
    # 2. Adiciona visualizador de PDF antes do primeiro modal
    if '<!-- Modal' in content:
        content = content.replace('    <!-- Modal', PDF_VIEWER_HTML + '\n    <!-- Modal')
    
    # 3. Adiciona modais antes de </body> ou antes do <script>
    if '<script>' in content:
        content = content.replace('    <script>', MODALS_HTML + '\n    <script>')
    
    # 4. Adiciona JavaScript no início do <script>
    content = re.sub(
        r'(<script>\s*)',
        r'\1' + ADDITIONAL_JS,
        content,
        count=1
    )
    
    # 5. Atualiza lógica de sucesso (response.ok)
    # Procura por padrão de download direto e substitui
    old_success_pattern = r'(const blob = await response\.blob\(\);)\s+(const url = window\.URL\.createObjectURL\(blob\);)\s+(const a = document\.createElement\(\'a\'\);)\s+(a\.href = url;)\s+(a\.download = [^;]+;)\s+(document\.body\.appendChild\(a\);)\s+(a\.click\(\);)\s+(window\.URL\.revokeObjectURL\(url\);)\s+(document\.body\.removeChild\(a\);)'
    
    new_success_code = r'\1\n                    pdfBlobUrl = window.URL.createObjectURL(blob);\n                    pdfFileName = \5\n                    \n                    const newBalance = response.headers.get(\'X-New-Balance\');\n                    \n                    // Mostra modal de sucesso\n                    mostrarModalSucesso();'
    
    content = re.sub(old_success_pattern, new_success_code, content, flags=re.DOTALL)
    
    # 6. Atualiza lógica de erro
    content = re.sub(
        r'(message\.className = \'message error\';)\s+(message\.textContent = [^;]+;)\s+(message\.style\.display = \'block\';)',
        r'mostrarModalErro(\2);',
        content
    )
    
    # Salva arquivo atualizado
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  ✓ Atualizado com sucesso!")
    return True

def main():
    consultas_dir = r'backend\public\consultas'
    
    # Lista de arquivos para atualizar (exceto base-nacional que já foi feito)
    files_to_update = [
        'base-estadual.html',
        'crlv-e-turbo.html',
        'codigo-seguranca-pdf.html',
        'csv-renainf-renajud-recall-bin-proprietar.html',
        'gravame-v2.html',
        'ano-licenciamento-bin-nacional.html',
        'consulta-cautelar.html',
        'consulta-chassi.html',
        'consulta-leilao.html',
        'consulta-comunicado-venda.html',
        'crlv-e-agendado.html',
        'crv-digital-agendado.html',
        'proprietario-atual-v2.html',
        'proprietario-atual-restricoes.html',
        'reemissao-atpv-e.html',
        'verifica-autenticidade-crv.html'
    ]
    
    updated_count = 0
    for filename in files_to_update:
        filepath = os.path.join(consultas_dir, filename)
        if os.path.exists(filepath):
            if update_html_file(filepath):
                updated_count += 1
        else:
            print(f"Arquivo não encontrado: {filepath}")
    
    print(f"\n✅ Total de arquivos atualizados: {updated_count}/{len(files_to_update)}")

if __name__ == '__main__':
    main()
