const db = require('../config/db');

const obtenerReporteGeneral = async (req, res, next) => {
  try {
    // Consulta consolidada en un solo viaje de red a la base de datos (mejora de rendimiento)
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM estudiantes) AS estudiantes,
        (SELECT COUNT(*) FROM asistencias) AS asistencias,
        (SELECT COUNT(*) FROM materias) AS materias
    `;
    const [rows] = await db.query(query);

    res.status(200).json({
      success: true,
      message: 'Reporte consolidado generado exitosamente',
      data: {
        estudiantes: rows[0].estudiantes,
        asistencias: rows[0].asistencias,
        materias: rows[0].materias
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerReporteGeneral
};