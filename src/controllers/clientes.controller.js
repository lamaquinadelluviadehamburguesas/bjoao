import { pool } from '../db.js';

// Obtener todos los clientes
export const obtenerClientes = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM Clientes WHERE estado = TRUE OR estado IS NULL');
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos de los clientes.',
      error: error
    });
  }
};

// Obtener un cliente por su id
export const obtenerCliente = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM Clientes WHERE id_cliente = ? AND (estado = TRUE OR estado IS NULL)', [req.params.id]);
    
    if (result.length <= 0) {
      return res.status(404).json({
        mensaje: `Error al leer los datos. El ID ${req.params.id} del cliente no encontrado.`
      });
    }
    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos del cliente.',
      error: error
    });
  }
};

// Registrar un nuevo cliente
export const registrarCliente = async (req, res) => {
  try {
    const { 
      primer_nombre, 
      segundo_nombre, 
      primer_apellido, 
      segundo_apellido, 
      celular, 
      direccion, 
      cedula 
    } = req.body;

    // Validación básica de campos obligatorios
    if (!primer_nombre || !primer_apellido || !celular || !cedula) {
      return res.status(400).json({
        mensaje: 'Los campos primer_nombre, primer_apellido, celular y cedula son obligatorios.'
      });
    }

    const [result] = await pool.query(
      'INSERT INTO Clientes (primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, celular, direccion, cedula, estado) VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)',
      [primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, celular, direccion, cedula]
    );

    res.status(201).json({ id_cliente: result.insertId });
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al registrar el cliente.',
      error: error
    });
  }
};

// Eliminar un cliente por su ID (eliminación suave)
export const eliminarCliente = async (req, res) => {
  try {
    console.log('Iniciando eliminación de cliente:', req.params.id);

    // Primero verificar si el cliente existe
    const [checkClient] = await pool.query(
      'SELECT * FROM Clientes WHERE id_cliente = ?',
      [req.params.id]
    );

    console.log('Resultado de verificación de cliente:', checkClient);

    if (checkClient.length === 0) {
      return res.status(404).json({
        mensaje: `El cliente con ID ${req.params.id} no existe.`,
        success: false
      });
    }

    // Verificar si tiene ventas asociadas
    const [ventasAsociadas] = await pool.query(
      'SELECT COUNT(*) as count FROM Ventas WHERE id_cliente = ?',
      [req.params.id]
    );

    console.log('Ventas asociadas:', ventasAsociadas[0]);

    if (ventasAsociadas[0].count > 0) {
      return res.status(400).json({
        mensaje: 'No se puede eliminar el cliente ya que tiene una venta asociada',
        tieneVentas: true,
        cantidadVentas: ventasAsociadas[0].count
      });
    }

    // Intentar actualizar el estado del cliente
    const [result] = await pool.query(
      'UPDATE Clientes SET estado = ? WHERE id_cliente = ?',
      [false, req.params.id]
    );

    console.log('Resultado de actualización:', result);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        mensaje: `Error al eliminar el cliente. El ID ${req.params.id} no fue encontrado.`,
        success: false
      });
    }

    // Si todo salió bien, enviar mensaje de éxito
    return res.json({
      mensaje: 'Cliente eliminado con éxito',
      success: true
    });
  } catch (error) {
    console.error('Error detallado al eliminar cliente:', {
      error: error,
      stack: error.stack,
      message: error.message,
      code: error.code
    });

    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al eliminar el cliente.',
      error: error.message,
      success: false
    });
  }
};

// Actualizar un cliente por su ID (parcial o completa)
export const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    // Asegurarse de que no se pueda cambiar el estado a través de la actualización
    if (datos.estado !== undefined) {
      delete datos.estado;
    }

    const [resultado] = await pool.query(
      'UPDATE Clientes SET ? WHERE id_cliente = ? AND (estado = TRUE OR estado IS NULL)',
      [datos, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: `El cliente con ID ${id} no existe o está inactivo.`,
      });
    }

    res.status(204).send(); // Respuesta sin contenido para indicar éxito
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Error al actualizar el cliente.',
      error: error,
    });
  }
};