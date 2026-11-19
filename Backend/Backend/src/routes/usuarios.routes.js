const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');

// GET /api/usuarios -> Listar todos
router.get('/', usuariosController.obtenerUsuarios);

// GET /api/usuarios/:id -> Obtener por ID
router.get('/:id', usuariosController.obtenerUsuarioPorId);

// PUT /api/usuarios/:id -> Actualizar
router.put('/:id', usuariosController.actualizarUsuario);

// DELETE /api/usuarios/:id -> Eliminar
router.delete('/:id', usuariosController.eliminarUsuario);

module.exports = router;