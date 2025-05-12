import { Router } from 'express';
import { actualizarCategoria, eliminarCategoria, obtenerCategorias,registrarCategoria } from '../controllers/categorias.controller.js';

const router = Router();

// Ruta para obtener todos las categorias
router.get('/categorias', obtenerCategorias);

// Ruta para registrar las categorias
router.post('/registrarcategoria', registrarCategoria);

// Ruta para eliminar un categoria por su ID
router.delete('/eliminarcategoria/:id', eliminarCategoria);

router.patch('/actualizarcategoria/:id', actualizarCategoria);


export default router;