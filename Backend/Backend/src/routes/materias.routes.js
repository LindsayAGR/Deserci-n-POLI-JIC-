const express = require('express');
const router = express.Router();
const materiasController = require('../controllers/materias.controller');

// GET /api/materias -> Listar todas
router.get('/', materiasController.obtenerMaterias);

// GET /api/materias/:id -> Obtener por ID
router.get('/:id', materiasController.obtenerMateriaPorId);

// POST /api/materias -> Crear materia
router.post('/', materiasController.crearMateria);

// PUT /api/materias/:id -> Actualizar materia
router.put('/:id', materiasController.actualizarMateria);

// DELETE /api/materias/:id -> Eliminar materia
router.delete('/:id', materiasController.eliminarMateria);

module.exports = router;