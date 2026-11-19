const db = require('../config/db');

const obtenerReporteGeneral = async (req, res, next) => {
  try {
    // Ejemplo de consultas para consolidar datos del sistema de deserción
    const [totalEstudiantes] = await db.query('SELECT COUNT(*) AS total FROM estudiantes');
    const [totalAsistencias] = await db.query('SELECT COUNT(*) AS total FROM asistencias');
    const [totalMaterias] = await db.query('SELECT COUNT(*) AS total FROM materias');

    res.status(200).json({
      success: true,
      message: 'Reporte consolidado generado exitosamente',
      data: {
        estudiantes: totalEstudiantes[0].total,
        asistencias: totalAsistencias[0].total,
        materias: totalMaterias[0].total
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerReporteGeneral
};