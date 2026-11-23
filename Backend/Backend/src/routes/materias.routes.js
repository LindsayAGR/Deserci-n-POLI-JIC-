const express = require('express');
const router = express.Router();
const materiasController = require('../controllers/materias.controller');
const { checkRole } = require('../middlewares/auth.middleware');

// GET /api/materias -> Listar todas (accesible para usuarios autenticados)
router.get('/', materiasController.obtenerMaterias);

// GET /api/materias/:id -> Obtener por ID
router.get('/:id', materiasController.obtenerMateriaPorId);

// Mutaciones restringidas a Administrador / Coordinador y Super Admin
router.post('/', checkRole(['Administrador', 'Super Admin']), materiasController.crearMateria);
router.put('/:id', checkRole(['Administrador', 'Super Admin']), materiasController.actualizarMateria);
router.delete('/:id', checkRole(['Administrador', 'Super Admin']), materiasController.eliminarMateria);

module.exports = router;