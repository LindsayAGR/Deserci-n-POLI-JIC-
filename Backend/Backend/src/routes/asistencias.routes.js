const express = require('express');
const router = express.Router();
const asistenciasController = require('../controllers/asistencias.controller');
const { checkRole } = require('../middlewares/auth.middleware');

// GET /api/asistencias -> Listar todas (filtrable por parámetros de consulta)
router.get('/', asistenciasController.obtenerAsistencias);

// GET /api/asistencias/:id -> Obtener por ID
router.get('/:id', asistenciasController.obtenerAsistenciaPorId);

// POST /api/asistencias -> Crear registro de asistencia (Docente, Admin, Super Admin)
router.post('/', asistenciasController.crearAsistencia);

// DELETE /api/asistencias/:id -> Eliminar asistencia (Solo Admins / Super Admin)
router.delete('/:id', checkRole(['Administrador', 'Super Admin']), asistenciasController.eliminarAsistencia);

module.exports = router;