-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS ferreteria_bd;

-- Usar la base de datos
USE ferreteria_bd;

-- Crear la tabla Usuarios si no existe
CREATE TABLE IF NOT EXISTS Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    contraseña VARCHAR(100) NOT NULL,
    rol VARCHAR(20) DEFAULT 'existente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar el usuario administrador
INSERT INTO Usuarios (usuario, contraseña, rol) 
VALUES ('eli', 'admin123', 'admin')
ON DUPLICATE KEY UPDATE rol = 'admin';

-- Actualizar usuarios existentes
UPDATE Usuarios SET rol = 'existente' WHERE rol IS NULL; 