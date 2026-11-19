const express = require('express');
const router = express.Router();
const { 
  obtenerEstudiantes, 
  crearEstudiante, 
  actualizarEstudiante, 
  eliminarEstudiante 
} = require('../controllers/estudiantes.controller');

// Asegúrate de que cada función pasada como segundo parámetro NO sea undefined
router.get('/', obtenerEstudiantes);
router.post('/', crearEstudiante);
router.put('/:id', actualizarEstudiante);
router.delete('/:id', eliminarEstudiante);

module.exports = router;