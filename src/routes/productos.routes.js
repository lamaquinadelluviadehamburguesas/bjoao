import { Router } from 'express';
import {  obtenerProductos,actualizarProducto, eliminarProducto, obtenerProducto, registrarProducto } from '../controllers/productos.controller.js';

const router = Router();

// Ruta para obtener todos los productos
router.get('/productos', obtenerProductos);

// Ruta para obtener un produto por su ID
router.get('/producto/:id', obtenerProducto);

router.post('/registrarproductos', registrarProducto);

// Ruta para eliminar un producto por su ID
router.delete('/eliminarproducto/:id', eliminarProducto);

// Ruta para actualizar un producto por su ID
router.patch('/actualizarproducto/:id', actualizarProducto);


export default router;