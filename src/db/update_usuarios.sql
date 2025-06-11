USE ferreteria_bd;

-- Agregar la columna rol a la tabla Usuarios
ALTER TABLE Usuarios ADD COLUMN rol VARCHAR(20) DEFAULT 'existente';

-- Actualizar el usuario eli para que sea administrador
UPDATE Usuarios SET rol = 'admin' WHERE usuario = 'eli';

-- Asegurarse de que el usuario eli existe
INSERT INTO Usuarios (usuario, contraseña, rol) 
SELECT 'eli', 'eli2025', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM Usuarios WHERE usuario = 'eli'); 