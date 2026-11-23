const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportes.controller');
const { checkRole } = require('../middlewares/auth.middleware');

// GET /api/reportes -> Obtener reporte general (Solo Administrador y Super Admin)
router.get('/', checkRole(['Administrador', 'Super Admin']), reportesController.obtenerReporteGeneral);

module.exports = router;