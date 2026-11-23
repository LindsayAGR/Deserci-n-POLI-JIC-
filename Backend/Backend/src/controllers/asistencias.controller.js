const db = require('../config/db');

// GET /api/asistencias
const obtenerAsistencias = async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 1000, 1), 5000);
    const query = 'SELECT * FROM asistencias ORDER BY fecha DESC, id_asistencia DESC LIMIT ?';
    const [asistencias] = await db.query(query, [limit]);
    res.status(200).json({ success: true, data: asistencias });
  } catch (error) {
    next(error);
  }
};

// GET /api/asistencias/:id
const obtenerAsistenciaPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM asistencias WHERE id_asistencia = ?';
    const [asistencia] = await db.query(query, [id]);

    if (asistencia.length === 0) {
      return res.status(404).json({ success: false, message: 'Asistencia no encontrada.' });
    }

    res.status(200).json({ success: true, data: asistencia[0] });
  } catch (error) {
    next(error);
  }
};

// POST /api/asistencias
const crearAsistencia = async (req, res, next) => {
  try {
    const { fk_estudiante, estado, fecha } = req.body;

    if (!fk_estudiante || !estado) {
      return res.status(400).json({ 
        success: false, 
        message: 'El ID del estudiante y el estado son obligatorios.' 
      });
    }

    const fechaFinal = fecha || new Date().toISOString().slice(0, 19).replace('T', ' ');

    const query = 'INSERT INTO asistencias (fecha, estado, fk_estudiante) VALUES (?, ?, ?)';
    await db.query(query, [fechaFinal, estado, fk_estudiante]);

    res.status(201).json({ success: true, message: 'Asistencia registrada correctamente.' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/asistencias/:id
const eliminarAsistencia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [resultado] = await db.query('DELETE FROM asistencias WHERE id_asistencia = ?', [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Asistencia no encontrada.' });
    }

    res.status(200).json({ success: true, message: 'Asistencia eliminada correctamente.' });
  } catch (error) {
    next(error);
  }
};

// EXPORTAR TODAS PARA QUE EL ROUTER NO FALLE
module.exports = {
  obtenerAsistencias,
  obtenerAsistenciaPorId,
  crearAsistencia,
  eliminarAsistencia
};