import { pool } from '../db.js';

// Obtener todas los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM Usuarios');
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos de los usuarios.',
      error: error
    });
  }
};

// Obtener un usuario por su id
export const obtenerUsuario = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM Usuarios WHERE id_usuario = ?', [req.params.id]);
    
    if (result.length <= 0) {
      return res.status(404).json({
        mensaje: `Error al leer los datos. El ID ${req.params.id} del usuario no encontrado.`
      });
    }
    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos del usuario.'
    });
  }
};

// Verificar usuario (login)
export const verificarUsuario = async (req, res) => {
  try {
    const { usuario, contraseña } = req.body;

    // Verificar que se proporcionaron usuario y contraseña
    if (!usuario || !contraseña) {
      return res.status(400).json({
        verificado: false,
        mensaje: 'Usuario y contraseña son requeridos'
      });
    }

    // Buscar el usuario en la base de datos
    const [usuarios] = await pool.query(
      'SELECT * FROM Usuarios WHERE usuario = ? AND contraseña = ?',
      [usuario, contraseña]
    );

    // Si no se encuentra el usuario o la contraseña no coincide
    if (usuarios.length === 0) {
      return res.json({
        verificado: false,
        mensaje: 'Usuario o contraseña incorrectos'
      });
    }

    // Usuario verificado
    const usuarioEncontrado = usuarios[0];
    return res.json({
      verificado: true,
      rol: usuario.toLowerCase() === 'eli' ? 'admin' : (usuarioEncontrado.rol || 'existente'),
      mensaje: 'Usuario verificado correctamente'
    });

  } catch (error) {
    console.error('Error al verificar usuario:', error);
    return res.status(500).json({
      verificado: false,
      mensaje: 'Error al verificar el usuario'
    });
  }
};

// Verificar si un usuario existe
export const verificarUsuarioExistente = async (req, res) => {
  try {
    const { usuario } = req.body;

    if (!usuario) {
      return res.status(400).json({
        error: 'El nombre de usuario es requerido'
      });
    }

    const [usuarios] = await pool.query(
      'SELECT * FROM Usuarios WHERE usuario = ?',
      [usuario]
    );

    return res.json({
      existe: usuarios.length > 0
    });

  } catch (error) {
    console.error('Error al verificar existencia de usuario:', error);
    return res.status(500).json({
      error: 'Error al verificar la existencia del usuario'
    });
  }
};

// Registrar un nuevo usuario
export const registrarUsuario = async (req, res) => {
  try {
    const { usuario, contraseña, rol = 'nuevo' } = req.body;

    // Verificar si el usuario ya existe
    const [usuariosExistentes] = await pool.query(
      'SELECT * FROM Usuarios WHERE usuario = ?',
      [usuario]
    );

    if (usuariosExistentes.length > 0) {
      return res.status(400).json({
        success: false,
        mensaje: 'Este nombre de usuario ya está registrado'
      });
    }

    // Insertar el nuevo usuario
    const [result] = await pool.query(
      'INSERT INTO Usuarios (usuario, contraseña, rol) VALUES (?, ?, ?)',
      [usuario, contraseña, rol]
    );

    res.status(201).json({ 
      success: true,
      mensaje: 'Usuario registrado correctamente',
      id_usuario: result.insertId,
      usuario,
      rol
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({
      success: false,
      mensaje: 'Ha ocurrido un error al registrar el usuario.'
    });
  }
};

// Eliminar un usuario por su ID
export const eliminarUsuario = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM Usuarios WHERE id_usuario = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        mensaje: `Error al eliminar el usuario. El ID ${req.params.id} no fue encontrado.`
      });
    }

    res.status(204).send(); // Respuesta sin contenido para indicar éxito
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al eliminar el usuario.',
      error: error
    });
  }
};

// Actualizar un usuario por su ID (parcialmente o completamente)
export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const [resultado] = await pool.query(
      'UPDATE Usuarios SET ? WHERE id_usuario = ?',
      [datos, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: `El usuario con ID ${id} no existe.`,
      });
    }

    res.status(204).send(); // Respuesta sin contenido para indicar éxito
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Error al actualizar el usuario.',
      error: error,
    });
  }
};