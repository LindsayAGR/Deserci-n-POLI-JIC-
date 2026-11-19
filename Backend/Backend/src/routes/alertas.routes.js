const express = require('express');
const router = express.Router();
const alertasController = require('../controllers/alertas.controller');

// GET /api/alertas -> Listar todas las alertas
router.get('/', alertasController.obtenerAlertas);

// POST /api/alertas -> Crear una nueva alerta
router.post('/', alertasController.crearAlerta);

// PUT /api/alertas/:id -> Actualizar alerta
router.put('/:id', alertasController.actualizarAlerta);

// DELETE /api/alertas/:id -> Eliminar alerta
router.delete('/:id', alertasController.eliminarAlerta);

module.exports = router;