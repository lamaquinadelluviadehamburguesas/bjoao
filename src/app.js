import express from 'express';
import cors from 'cors';
import rutasClientes from './routes/clientes.routes.js';
import rutasUsuarios from './routes/usuarios.routes.js';
import rutasProductos from './routes/productos.routes.js';
import rutasCategorias from './routes/categorias.routes.js';
import rutasVentas from './routes/ventas.routes.js';
import rutasCompras from './routes/compras.routes.js'; // Única importación
import rutasEmpleados from './routes/empleados.routes.js';
import rutasDetallesVentas from './routes/detalles_ventas.routes.js';
import rutasDetallesCompras from './routes/detalles_compras.routes.js';

const app = express();

// Habilitar CORS para cualquier origen
app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.json({ limit: '10mb' })); // Aumenta a 10 MB
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(express.json());

app.use('/api', rutasClientes);
app.use('/api', rutasUsuarios);
app.use('/api', rutasProductos);
app.use('/api', rutasCategorias);
app.use('/api', rutasVentas);
app.use('/api', rutasCompras);
app.use('/api', rutasEmpleados);
app.use('/api', rutasDetallesVentas);
app.use('/api', rutasDetallesCompras);
// Nota: Se eliminó la segunda app.use('/api', rutasCompras) duplicada

// Manejo de rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({
        message: 'La ruta que ha especificado no se encuentra registrada.'
    });
});

export default app;