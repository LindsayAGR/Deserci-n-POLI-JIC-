const express = require('express');
const router = express.Router();
const { 
  obtenerEstudiantes, 
  crearEstudiante, 
  actualizarEstudiante, 
  eliminarEstudiante 
} = require('../controllers/estudiantes.controller');
const { checkRole } = require('../middlewares/auth.middleware');

// GET accesible para todos los usuarios autenticados (Docente, Coordinador, Super Admin)
router.get('/', obtenerEstudiantes);

// Mutaciones restringidas a Administrador / Coordinador y Super Admin
router.post('/', checkRole(['Administrador', 'Super Admin']), crearEstudiante);
router.put('/:id', checkRole(['Administrador', 'Super Admin']), actualizarEstudiante);
router.delete('/:id', checkRole(['Administrador', 'Super Admin']), eliminarEstudiante);

module.exports = router;