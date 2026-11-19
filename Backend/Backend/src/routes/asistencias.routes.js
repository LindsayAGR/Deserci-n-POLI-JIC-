const express = require('express');
const router = express.Router();
const asistenciasController = require('../controllers/asistencias.controller'); // Asegúrate de que el nombre del archivo del controlador coincida exactamente

// GET /api/asistencias -> Listar todas
router.get('/', asistenciasController.obtenerAsistencias);

// GET /api/asistencias/:id -> Obtener por ID
router.get('/:id', asistenciasController.obtenerAsistenciaPorId);

// POST /api/asistencias -> Crear registro de asistencia
router.post('/', asistenciasController.crearAsistencia);

// DELETE /api/asistencias/:id -> Eliminar asistencia
router.delete('/:id', asistenciasController.eliminarAsistencia);

module.exports = router;