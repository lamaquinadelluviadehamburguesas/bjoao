import { pool } from '../db.js';

// Obtener todas las categorias
export const obtenerCategorias= async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM Categorias');
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos de las categorias.',
      error: error
    });
  }
};

// Obtener una categoria por su id
export const obtenerCategoria = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM Categorias WHERE id_categoria = ?', [req.params.id]);
    
    if (result.length <= 0) {
      return res.status(404).json({
        mensaje: `Error al leer los datos. El ID ${req.params.id} de la categoria no encontrado.`
      });
    }
    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos del cliente.'
    });
  }
};


// Registrar una nueva categoría
export const registrarCategoria = async (req, res) => {
  try {
    const { nombre_categoria, descripcion_categoria } = req.body;

    const [result] = await pool.query(
      'INSERT INTO categorias (nombre_categoria, descripcion_categoria) VALUES (?, ?)',
      [nombre_categoria, descripcion_categoria]
    );

    res.status(201).json({ id_categoria: result.insertId });
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al registrar la categoría.',
      error: error
    });
  }
};

// Eliminar una categoría por su ID
export const eliminarCategoria = async (req, res) => {
  try {
    // Primero verificamos si hay productos que usan esta categoría
    const [productos] = await pool.query(
      'SELECT COUNT(*) as count FROM productos WHERE id_categoria = ?',
      [req.params.id]
    );

    if (productos[0].count > 0) {
      return res.status(400).json({
        mensaje: 'No se puede eliminar la categoría porque hay productos asociados a ella. Primero debe reasignar o eliminar los productos.'
      });
    }

    // Si no hay productos asociados, procedemos con la eliminación
    const [result] = await pool.query(
      'DELETE FROM categorias WHERE id_categoria = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        mensaje: `Error al eliminar la categoría. El ID ${req.params.id} no fue encontrado.`
      });
    }

    // Enviamos una respuesta con estado 200 y un mensaje de éxito
    return res.status(200).json({
      mensaje: 'Categoría eliminada correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al eliminar la categoría.',
      error: error.message
    });
  }
};

// Actualizar una categoría por su ID (parcial o completa)
export const actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const [resultado] = await pool.query(
      'UPDATE categorias SET ? WHERE id_categoria = ?',
      [datos, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: `La categoría con ID ${id} no existe.`,
      });
    }

    res.status(204).send(); // Respuesta sin contenido para indicar éxito
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Error al actualizar la categoría.',
      error: error,
    });
  }
};
