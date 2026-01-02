-- ============================================
-- TABELA DE NOTIFICAÇÕES
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
  target_type ENUM('all', 'specific') DEFAULT 'all',
  target_user_id INT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  show_close_button BOOLEAN DEFAULT TRUE,
  link_url VARCHAR(500) NULL,
  link_text VARCHAR(100) NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Índices para melhor performance
CREATE INDEX idx_notifications_active ON notifications(is_active);
CREATE INDEX idx_notifications_target ON notifications(target_type, target_user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================
-- TABELA DE NOTIFICAÇÕES LIDAS (por usuário)
-- ============================================

CREATE TABLE IF NOT EXISTS notification_reads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  notification_id INT NOT NULL,
  user_id INT NOT NULL,
  read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_read (notification_id, user_id)
);

-- Índice para consultas rápidas
CREATE INDEX idx_notification_reads_user ON notification_reads(user_id, notification_id);

-- ============================================
-- INSERIR NOTIFICAÇÃO DE EXEMPLO
-- ============================================

INSERT INTO notifications (title, message, type, target_type, created_by) 
VALUES (
  '📢 Recarga via Pix disponível novamente!',
  'Informamos que a opção de Recarga via Pix já está normalizada em nossa plataforma ✅',
  'success',
  'all',
  1
);

-- Verificar
SELECT * FROM notifications ORDER BY created_at DESC LIMIT 5;
