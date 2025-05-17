import { pool2 } from '../db.js';

// 1. Análisis de Ventas por Dimensión Tiempo

// 1.1 Total de ventas por día
export const totalVentasPorDia = async (req, res) => {
  try {
    const [result] = await pool2.query(
        `SELECT DATE_FORMAT(t.fecha, '%Y-%m-%d') AS dia, SUM(hv.total_linea) AS total_ventas
        FROM Hecho_Ventas hv
        JOIN Dim_Tiempo t ON hv.fecha = t.fecha
        GROUP BY t.fecha
        ORDER BY t.fecha;`
    );
    if (result.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron estadísticas de ventas.',
      });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener las estadísticas de ventas.',
      error: error.message,
    });
  }
};

// 1.2 Total de ventas por mes
export const totalVentasPorMes = async (req, res) => {
  try {
    const [result] = await pool2.query(
      `SELECT t.mes, ROUND(SUM(hv.total_linea),1) AS total_ventas
       FROM Hecho_Ventas hv
       JOIN Dim_Tiempo t ON hv.fecha = t.fecha
       GROUP BY t.mes
       ORDER BY t.mes;`
    );
    if (result.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron estadísticas de ventas por mes.',
      });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener las estadísticas de ventas por mes.',
      error: error.message,
    });
  }
};

// 1.3 Total de ventas por año
export const totalVentasPorAnio = async (req, res) => {
  try {
    const [result] = await pool2.query(
      `SELECT t.año, ROUND(SUM(hv.total_linea), 2) AS total_ventas
       FROM Hecho_Ventas hv
       JOIN Dim_Tiempo t ON hv.fecha = t.fecha
       GROUP BY t.año
       ORDER BY t.año;`
    );
    if (result.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron estadísticas de ventas por año.',
      });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener las estadísticas de ventas por año.',
      error: error.message,
    });
  }
};

// 2. Análisis de Ventas por Empleado

// 2.1 Total de ventas por empleado
export const totalVentasPorEmpleado = async (req, res) => {
  try {
    const [result] = await pool2.query(
      `SELECT e.primer_nombre, e.segundo_nombre, e.primer_apellido, ROUND(SUM(hv.total_linea),2) AS total_ventas
       FROM Hecho_Ventas hv
       JOIN Dim_Empleados e ON hv.id_empleado = e.id_empleado
       GROUP BY e.id_empleado, e.primer_nombre, e.segundo_nombre, e.primer_apellido
       ORDER BY total_ventas DESC;`
    );
    if (result.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron estadísticas de ventas por empleado.',
      });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener las estadísticas de ventas por empleado.',
      error: error.message,
    });
  }
};

// 2.2 Cantidad de ventas por empleado
export const cantidadVentasPorEmpleado = async (req, res) => {
  try {
    const [result] = await pool2.query(
      `SELECT e.primer_nombre, e.segundo_nombre, e.primer_apellido, COUNT(DISTINCT hv.id_venta) AS cantidad_ventas
       FROM Hecho_Ventas hv
       JOIN Dim_Empleados e ON hv.id_empleado = e.id_empleado
       GROUP BY e.id_empleado, e.primer_nombre, e.segundo_nombre, e.primer_apellido
       ORDER BY cantidad_ventas DESC;`
    );
    if (result.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron estadísticas de cantidad de ventas por empleado.',
      });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener las estadísticas de cantidad de ventas por empleado.',
      error: error.message,
    });
  }
};

// 2.3 Total de ventas por empleado y mes
export const totalVentasPorEmpleadoYMes = async (req, res) => {
  try {
    const [result] = await pool2.query(
      `SELECT e.primer_nombre, e.segundo_nombre, e.primer_apellido, t.año, t.mes, SUM(hv.total_linea) AS total_ventas
       FROM Hecho_Ventas hv
       JOIN Dim_Empleados e ON hv.id_empleado = e.id_empleado
       JOIN Dim_Tiempo t ON hv.fecha = t.fecha
       GROUP BY e.id_empleado, e.primer_nombre, e.segundo_nombre, e.primer_apellido, t.año, t.mes
       ORDER BY t.año, t.mes, total_ventas DESC;`
    );
    if (result.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron estadísticas de ventas por empleado y mes.',
      });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener las estadísticas de ventas por empleado y mes.',
      error: error.message,
    });
  }
};

// 3. Análisis de Ventas por Cliente

// 3.1 Total de compras por cliente
export const totalComprasPorCliente = async (req, res) => {
  try {
    const [result] = await pool2.query(
      `SELECT c.primer_nombre, c.segundo_nombre, c.primer_apellido, ROUND(SUM(hv.total_linea),2) AS total_compras
       FROM Hecho_Ventas hv
       JOIN Dim_Clientes c ON hv.id_cliente = c.id_cliente
       GROUP BY c.id_cliente, c.primer_nombre, c.segundo_nombre, c.primer_apellido
       ORDER BY total_compras DESC;`
    );
    if (result.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron estadísticas de compras por cliente.',
      });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener las estadísticas de compras por cliente.',
      error: error.message,
    });
  }
};

// 3.2 Cantidad de compras por cliente
export const cantidadComprasPorCliente = async (req, res) => {
  try {
    const [result] = await pool2.query(
      `SELECT c.primer_nombre, c.segundo_nombre, c.primer_apellido, COUNT(DISTINCT hv.id_venta) AS cantidad_compras
       FROM Hecho_Ventas hv
       JOIN Dim_Clientes c ON hv.id_cliente = c.id_cliente
       GROUP BY c.id_cliente, c.primer_nombre, c.segundo_nombre, c.primer_apellido
       ORDER BY cantidad_compras DESC;`
    );
    if (result.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron estadísticas de cantidad de compras por cliente.',
      });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener las estadísticas de cantidad de compras por cliente.',
      error: error.message,
    });
  }
};

// 3.3 Total de compras por cliente y mes
export const totalComprasPorClienteYMes = async (req, res) => {
  try {
    const [result] = await pool2.query(
      `SELECT c.primer_nombre, c.segundo_nombre, c.primer_apellido, t.año, t.mes, SUM(hv.total_linea) AS total_compras
       FROM Hecho_Ventas hv
       JOIN Dim_Clientes c ON hv.id_cliente = c.id_cliente
       JOIN Dim_Tiempo t ON hv.fecha = t.fecha
       GROUP BY c.id_cliente, c.primer_nombre, c.segundo_nombre, c.primer_apellido, t.año, t.mes
       ORDER BY t.año, t.mes, total_compras DESC;`
    );
    if (result.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron estadísticas de compras por cliente y mes.',
      });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener las estadísticas de compras por cliente y mes.',
      error: error.message,
    });
  }
};

// 4. Análisis de Ventas por Producto

// 4.2 Productos más vendidos por valor total
export const productosMasVendidosPorValor = async (req, res) => {
  try {
    const [result] = await pool2.query(
      `SELECT p.nombre_producto, SUM(hv.total_linea) AS total_ventas, SUM(hv.cantidad) AS cantidad_vendida
       FROM Hecho_Ventas hv
       JOIN Dim_Productos p ON hv.id_producto = p.id_producto
       GROUP BY p.id_producto, p.nombre_producto
       ORDER BY total_ventas DESC;`
    );
    if (result.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron estadísticas de productos más vendidos por valor.',
      });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener las estadísticas de productos más vendidos por valor.',
      error: error.message,
    });
  }
};

// 4.3 Ventas de productos por mes
export const ventasProductosPorMes = async (req, res) => {
  try {
    const [result] = await pool2.query(
      `SELECT p.nombre_producto, t.año, t.mes, SUM(hv.cantidad) AS cantidad_vendida, SUM(hv.total_linea) AS total_ventas
       FROM Hecho_Ventas hv
       JOIN Dim_Productos p ON hv.id_producto = p.id_producto
       JOIN Dim_Tiempo t ON hv.fecha = t.fecha
       GROUP BY p.id_producto, p.nombre_producto, t.año, t.mes
       ORDER BY t.año, t.mes, total_ventas DESC;`
    );
    if (result.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron estadísticas de ventas de productos por mes.',
      });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener las estadísticas de ventas de productos por mes.',
      error: error.message,
    });
  }
};

// 5. Análisis de Ventas por Categoría

// 5.1 Total de ventas por categoría
export const totalVentasPorCategoria = async (req, res) => {
  try {
    const [result] = await pool2.query(
      `SELECT p.nombre_categoria, SUM(hv.total_linea) AS total_ventas, SUM(hv.cantidad) AS cantidad_vendida
       FROM Hecho_Ventas hv
       JOIN Dim_Productos p ON hv.id_producto = p.id_producto
       GROUP BY p.nombre_categoria
       ORDER BY total_ventas DESC;`
    );
    if (result.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron estadísticas de ventas por categoría.',
      });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener las estadísticas de ventas por categoría.',
      error: error.message,
    });
  }
};

// 5.2 Total de ventas por categoría y mes
export const totalVentasPorCategoriaYMes = async (req, res) => {
  try {
    const [result] = await pool2.query(
      `SELECT p.nombre_categoria, t.año, t.mes, SUM(hv.total_linea) AS total_ventas, SUM(hv.cantidad) AS cantidad_vendida
       FROM Hecho_Ventas hv
       JOIN Dim_Productos p ON hv.id_producto = p.id_producto
       JOIN Dim_Tiempo t ON hv.fecha = t.fecha
       GROUP BY p.nombre_categoria, t.año, t.mes
       ORDER BY t.año, t.mes, total_ventas DESC;`
    );
    if (result.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron estadísticas de ventas por categoría y mes.',
      });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener las estadísticas de ventas por categoría y mes.',
      error: error.message,
    });
  }
};

// 10. Análisis de Stock

// 10.1 Productos con bajo stock
export const productosBajoStock = async (req, res) => {
  try {
    const [result] = await pool2.query(
      `SELECT p.nombre_producto, p.stock
       FROM Dim_Productos p
       WHERE p.stock < 50
       ORDER BY p.stock ASC;`
    );
    if (result.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron estadísticas de productos con bajo stock.',
      });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener las estadísticas de productos con bajo stock.',
      error: error.message,
    });
  }
};

// 10.2 Stock por categoría
export const stockPorCategoria = async (req, res) => {
  try {
    const [result] = await pool2.query(
      `SELECT p.nombre_categoria, SUM(p.stock) AS stock_total
       FROM Dim_Productos p
       GROUP BY p.nombre_categoria
       ORDER BY stock_total DESC;`
    );
    if (result.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron estadísticas de stock por categoría.',
      });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener las estadísticas de stock por categoría.',
      error: error.message,
    });
  }
};

// 11. Análisis Combinado de Ventas

// 11.1 Ventas por cliente, empleado y mes
export const ventasPorClienteEmpleadoYMes = async (req, res) => {
  try {
    const [result] = await pool2.query(
      `SELECT c.primer_nombre AS cliente_nombre, c.primer_apellido AS cliente_apellido,
              e.primer_nombre AS empleado_nombre, e.primer_apellido AS empleado_apellido,
              t.año, t.mes, SUM(hv.total_linea) AS total_ventas
       FROM Hecho_Ventas hv
       JOIN Dim_Clientes c ON hv.id_cliente = c.id_cliente
       JOIN Dim_Empleados e ON hv.id_empleado = e.id_empleado
       JOIN Dim_Tiempo t ON hv.fecha = t.fecha
       GROUP BY c.id_cliente, c.primer_nombre, c.primer_apellido,
                e.id_empleado, e.primer_nombre, e.primer_apellido,
                t.año, t.mes
       ORDER BY t.año, t.mes, total_ventas DESC;`
    );
    if (result.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron estadísticas de ventas por cliente, empleado y mes.',
      });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener las estadísticas de ventas por cliente, empleado y mes.',
      error: error.message,
    });
  }
};

// 11.2 Ventas por categoría, empleado y mes
export const ventasPorCategoriaEmpleadoYMes = async (req, res) => {
  try {
    const [result] = await pool2.query(
      `SELECT p.nombre_categoria, e.primer_nombre AS empleado_nombre, e.primer_apellido AS empleado_apellido,
              t.año, t.mes, SUM(hv.total_linea) AS total_ventas
       FROM Hecho_Ventas hv
       JOIN Dim_Productos p ON hv.id_producto = p.id_producto
       JOIN Dim_Empleados e ON hv.id_empleado = e.id_empleado
       JOIN Dim_Tiempo t ON hv.fecha = t.fecha
       GROUP BY p.nombre_categoria, e.id_empleado, e.primer_nombre, e.primer_apellido,
                t.año, t.mes
       ORDER BY t.año, t.mes, total_ventas DESC;`
    );
    if (result.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron estadísticas de ventas por categoría, empleado y mes.',
      });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener las estadísticas de ventas por categoría, empleado y mes.',
      error: error.message,
    });
  }
};

// 11.3 Ventas por cliente, categoría y mes
export const ventasPorClienteCategoriaYMes = async (req, res) => {
  try {
    const [result] = await pool2.query(
      `SELECT c.primer_nombre AS cliente_nombre, c.primer_apellido AS cliente_apellido,
              p.nombre_categoria, t.año, t.mes, SUM(hv.total_linea) AS total_ventas
       FROM Hecho_Ventas hv
       JOIN Dim_Clientes c ON hv.id_cliente = c.id_cliente
       JOIN Dim_Productos p ON hv.id_producto = p.id_producto
       JOIN Dim_Tiempo t ON hv.fecha = t.fecha
       GROUP BY c.id_cliente, c.primer_nombre, c.primer_apellido,
                p.nombre_categoria, t.año, t.mes
       ORDER BY t.año, t.mes, total_ventas DESC;`
    );
    if (result.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron estadísticas de ventas por cliente, categoría y mes.',
      });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener las estadísticas de ventas por cliente, categoría y mes.',
      error: error.message,
    });
  }
};

// 13. Análisis de Eficiencia de Empleados

// 13.1 Promedio de ventas por empleado
export const promedioVentasPorEmpleado = async (req, res) => {
  try {
    const [result] = await pool2.query(
      `SELECT e.primer_nombre, e.segundo_nombre, e.primer_apellido,
              AVG(hv.total_linea) AS promedio_ventas
       FROM Hecho_Ventas hv
       JOIN Dim_Empleados e ON hv.id_empleado = e.id_empleado
       GROUP BY e.id_empleado, e.primer_nombre, e.segundo_nombre, e.primer_apellido
       ORDER BY promedio_ventas DESC;`
    );
    if (result.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron estadísticas de promedio de ventas por empleado.',
      });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener las estadísticas de promedio de ventas por empleado.',
      error: error.message,
    });
  }
};

// 13.2 Promedio de ventas por empleado y mes
export const promedioVentasPorEmpleadoYMes = async (req, res) => {
  try {
    const [result] = await pool2.query(
      `SELECT e.primer_nombre, e.segundo_nombre, e.primer_apellido,
              t.año, t.mes, AVG(hv.total_linea) AS promedio_ventas
       FROM Hecho_Ventas hv
       JOIN Dim_Empleados e ON hv.id_empleado = e.id_empleado
       JOIN Dim_Tiempo t ON hv.fecha = t.fecha
       GROUP BY e.id_empleado, e.primer_nombre, e.segundo_nombre, e.primer_apellido,
                t.año, t.mes
       ORDER BY t.año, t.mes, promedio_ventas DESC;`
    );
    if (result.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron estadísticas de promedio de ventas por empleado y mes.',
      });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener las estadísticas de promedio de ventas por empleado y mes.',
      error: error.message,
    });
  }
};

// 14. Análisis de Clientes Frecuentes

// 14.1 Clientes que compran más frecuentemente
export const clientesFrecuentes = async (req, res) => {
  try {
    const [result] = await pool2.query(
      `SELECT c.primer_nombre, c.segundo_nombre, c.primer_apellido,
              COUNT(DISTINCT hv.id_venta) AS cantidad_compras,
              SUM(hv.total_linea) AS total_compras
       FROM Hecho_Ventas hv
       JOIN Dim_Clientes c ON hv.id_cliente = c.id_cliente
       GROUP BY c.id_cliente, c.primer_nombre, c.segundo_nombre, c.primer_apellido
       HAVING COUNT(DISTINCT hv.id_venta) > 1
       ORDER BY cantidad_compras DESC;`
    );
    if (result.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron estadísticas de clientes frecuentes.',
      });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener las estadísticas de clientes frecuentes.',
      error: error.message,
    });
  }
};

// 14.2 Clientes frecuentes por mes
export const clientesFrecuentesPorMes = async (req, res) => {
  try {
    const [result] = await pool2.query(
      `SELECT c.primer_nombre, c.segundo_nombre, c.primer_apellido,
              t.año, t.mes, COUNT(DISTINCT hv.id_venta) AS cantidad_compras
       FROM Hecho_Ventas hv
       JOIN Dim_Clientes c ON hv.id_cliente = c.id_cliente
       JOIN Dim_Tiempo t ON hv.fecha = t.fecha
       GROUP BY c.id_cliente, c.primer_nombre, c.segundo_nombre, c.primer_apellido,
                t.año, t.mes
       HAVING COUNT(DISTINCT hv.id_venta) > 1
       ORDER BY t.año, t.mes, cantidad_compras DESC;`
    );
    if (result.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron estadísticas de clientes frecuentes por mes.',
      });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener las estadísticas de clientes frecuentes por mes.',
      error: error.message,
    });
  }
};

// 15. Análisis de Productos por Cliente

// 15.1 Productos más comprados por cliente
export const productosMasCompradosPorCliente = async (req, res) => {
  try {
    const [result] = await pool2.query(
      `SELECT c.primer_nombre, c.segundo_nombre, c.primer_apellido,
              p.nombre_producto, SUM(hv.cantidad) AS cantidad_comprada,
              SUM(hv.total_linea) AS total_gastado
       FROM Hecho_Ventas hv
       JOIN Dim_Clientes c ON hv.id_cliente = c.id_cliente
       JOIN Dim_Productos p ON hv.id_producto = p.id_producto
       GROUP BY c.id_cliente, c.primer_nombre, c.segundo_nombre, c.primer_apellido,
                p.id_producto, p.nombre_producto
       ORDER BY total_gastado DESC;`
    );
    if (result.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron estadísticas de productos más comprados por cliente.',
      });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener las estadísticas de productos más comprados por cliente.',
      error: error.message,
    });
  }
};

// 15.2 Categorías más compradas por cliente
export const categoriasMasCompradasPorCliente = async (req, res) => {
  try {
    const [result] = await pool2.query(
      `SELECT c.primer_nombre, c.segundo_nombre, c.primer_apellido,
              p.nombre_categoria, SUM(hv.cantidad) AS cantidad_comprada,
              SUM(hv.total_linea) AS total_gastado
       FROM Hecho_Ventas hv
       JOIN Dim_Clientes c ON hv.id_cliente = c.id_cliente
       JOIN Dim_Productos p ON hv.id_producto = p.id_producto
       GROUP BY c.id_cliente, c.primer_nombre, c.segundo_nombre, c.primer_apellido,
                p.nombre_categoria
       ORDER BY total_gastado DESC;`
    );
    if (result.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron estadísticas de categorías más compradas por cliente.',
      });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener las estadísticas de categorías más compradas por cliente.',
      error: error.message,
    });
  }
};

// 16. Análisis de Ventas por Día de la Semana

// 16.1 Total de ventas por día de la semana
export const totalVentasPorDiaSemana = async (req, res) => {
  try {
    const [result] = await pool2.query(
      `SELECT t.dia_semana, SUM(hv.total_linea) AS total_ventas
       FROM Hecho_Ventas hv
       JOIN Dim_Tiempo t ON hv.fecha = t.fecha
       GROUP BY t.dia_semana
       ORDER BY total_ventas DESC;`
    );
    if (result.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron estadísticas de ventas por día de la semana.',
      });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).jsondown({
      mensaje: 'Ha ocurrido un error al obtener las estadísticas de ventas por día de la semana.',
      error: error.message,
    });
  }
};

// 16.2 Ventas por categoría y día de la semana
export const ventasPorCategoriaYDiaSemana = async (req, res) => {
  try {
    const [result] = await pool2.query(
      `SELECT p.nombre_categoria, t.dia_semana, SUM(hv.total_linea) AS total_ventas
       FROM Hecho_Ventas hv
       JOIN Dim_Productos p ON hv.id_producto = p.id_producto
       JOIN Dim_Tiempo t ON hv.fecha = t.fecha
       GROUP BY p.nombre_categoria, t.dia_semana
       ORDER BY total_ventas DESC;`
    );
    if (result.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron estadísticas de ventas por categoría y día de la semana.',
      });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener las estadísticas de ventas por categoría y día de la semana.',
      error: error.message,
    });
  }
};

// 17. Análisis de Rotación de Inventario

// 17.1 Productos con mayor rotación
// Obtener productos con mayor rotación
export const productosMayorRotacion = async (req, res) => {
  try {
    const [result] = await pool2.query(
      `SELECT p.nombre_producto, p.stock AS stock_inicial,
              SUM(hv.cantidad) AS total_vendido,
              (SUM(hv.cantidad) / p.stock) AS tasa_rotacion
       FROM Hecho_Ventas hv
       JOIN Dim_Productos p ON hv.id_producto = p.id_producto
       WHERE p.stock > 0
       GROUP BY p.id_producto, p.nombre_producto, p.stock
       ORDER BY tasa_rotacion DESC;`
    );
    if (result.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron estadísticas de productos con mayor rotación.',
      });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener las estadísticas de productos con mayor rotación.',
      error: error.message,
    });
  }
};

// 17.2 Categorías con mayor rotación
export const categoriasMayorRotacion = async (req, res) => {
  try {
    const [result] = await pool2.query(
      `SELECT p.nombre_categoria,
              SUM(p.stock) AS stock_total,
              SUM(hv.cantidad) AS total_vendido,
              (SUM(hv.cantidad) / SUM(p.stock)) AS tasa_rotacion
        FROM Hecho_Ventas hv
        JOIN Dim_Productos p ON hv.id_producto = p.id_producto
        GROUP BY p.nombre_categoria
        HAVING SUM(p.stock) > 0
        ORDER BY tasa_rotacion DESC;`
    );
    if (result.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron estadísticas de categorías con mayor rotación.',
      });
    }
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener las estadísticas de categorías con mayor rotación.',
      error: error.message,
    });
  }
};