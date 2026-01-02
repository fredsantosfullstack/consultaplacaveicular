-- Execute este comando no seu banco de dados para definir a senha do admin como 'admin123'

UPDATE users 
SET password = '$2a$10$3J2i.eB7.wL3jZ5.j5.j5u3j5.j5.j5.j5.j5.j5.j5.j5.j5.j5' 
WHERE email = 'admin@consultaplacaveicular.com.br';
