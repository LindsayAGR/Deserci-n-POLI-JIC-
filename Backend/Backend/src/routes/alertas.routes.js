const express = require('express');
const router = express.Router();
const alertasController = require('../controllers/alertas.controller');
const { checkRole } = require('../middlewares/auth.middleware');

// GET /api/alertas -> Listar todas las alertas
router.get('/', alertasController.obtenerAlertas);

// POST /api/alertas -> Crear una nueva alerta (usuarios autenticados)
router.post('/', alertasController.crearAlerta);

// PUT /api/alertas/:id -> Actualizar alerta (Solo Administrador y Super Admin)
router.put('/:id', checkRole(['Administrador', 'Super Admin']), alertasController.actualizarAlerta);

// DELETE /api/alertas/:id -> Eliminar alerta (Solo Administrador y Super Admin)
router.delete('/:id', checkRole(['Administrador', 'Super Admin']), alertasController.eliminarAlerta);

module.exports = router;