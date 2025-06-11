-- Agregar columna rol a la tabla Usuarios si no existe
ALTER TABLE Usuarios ADD COLUMN IF NOT EXISTS rol VARCHAR(20) DEFAULT 'existente';

-- Actualizar usuarios existentes para que tengan rol 'existente'
UPDATE Usuarios SET rol = 'existente' WHERE rol IS NULL;
 
-- Asegurarse de que el usuario 'eli' tenga rol 'admin'
INSERT INTO Usuarios (usuario, contraseña, rol) 
VALUES ('eli', 'admin123', 'admin')
ON DUPLICATE KEY UPDATE rol = 'admin'; 