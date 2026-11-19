const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportes.controller');

// GET /api/reportes -> Obtener reporte general
router.get('/', reportesController.obtenerReporteGeneral);

module.exports = router;