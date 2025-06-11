import { Router } from 'express';
import { obtenerUsuarios, actualizarUsuario, eliminarUsuario, obtenerUsuario, registrarUsuario, verificarUsuario, verificarUsuarioExistente } from '../controllers/usuarios.controller.js';

const router = Router();

// Ruta para obtener todos los usuarios.
router.get('/usuarios', obtenerUsuarios);

// Ruta para obtener un usuario por su ID.
router.get('/usuario/:user', obtenerUsuario);

// Ruta para verificar usuario (login)
router.post('/verificar', verificarUsuario);

// Ruta para verificar si un usuario existe
router.post('/verificarUsuarioExistente', verificarUsuarioExistente);

// Ruta para registrar nuevo usuario
router.post('/registrarusuario', registrarUsuario);

// Ruta para eliminar un usuario por su ID
router.delete('/eliminarusuario/:id', eliminarUsuario);

// Ruta para actualizar un usuario por su ID
router.patch('/actualizarusuario/:id', actualizarUsuario);

export default router;