import express from 'express';
import cors from 'cors';
import { pool } from './db.js';
import rutasClientes from './routes/clientes.routes.js';
import rutasUsuarios from './routes/usuarios.routes.js';
import rutasProductos from './routes/productos.routes.js';
import rutasCategorias from './routes/categorias.routes.js';
import rutasVentas from './routes/ventas.routes.js'
import rutasCompras from './routes/compras.routes.js'
import rutasEmpleados from './routes/empleados.routes.js'
import rutasDetallesVentas from './routes/detalles_ventas.routes.js';
import rutasDetallesCompras from'./routes/detalles_compras.routes.js';
import rutasEstadisticas from './routes/estadisticas.routes.js';
import rutasIA from './routes/ia.routes.js';

const app = express();

// Verificar conexión a la base de datos
const testDatabaseConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión a la base de datos establecida correctamente');
    connection.release();
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    process.exit(1); // Detener la aplicación si no hay conexión a la BD
  }
};

testDatabaseConnection();

// Configuración de CORS
app.use(cors({
    origin: 'http://localhost:5173', // Permitir solo el origen de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));

// Middlewares para parsear JSON y datos de formulario
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Middleware para logging de solicitudes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rutas
app.use('/api', rutasClientes);
app.use('/api', rutasUsuarios);
app.use('/api', rutasProductos);
app.use('/api', rutasCategorias);
app.use('/api', rutasVentas);
app.use('/api', rutasCompras);
app.use('/api', rutasEmpleados);
app.use('/api', rutasDetallesVentas);
app.use('/api', rutasDetallesCompras);
app.use('/api', rutasEstadisticas);
app.use('/ia', rutasIA);

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    mensaje: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    mensaje: 'La ruta que ha especificado no se encuentra registrada.'
  });
});

export default app;