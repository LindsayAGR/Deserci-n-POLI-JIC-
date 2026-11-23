const pool = require('../config/db');

// Obtener todos los estudiantes (o filtrados por rol del docente si es necesario)
const obtenerEstudiantes = async (req, res, next) => {
  try {
    const usuario = req.user; // Viene del middleware de autenticación (JWT)

    let query = `
      SELECT 
        e.id_estudiante, 
        e.nombre, 
        e.documento, 
        e.correo, 
        e.carrera, 
        e.grupo, 
        e.periodo, 
        e.fk_matricula 
      FROM estudiantes e
    `;

    let queryParams = [];

    // Si es un docente (rol 2), puedes aplicar algún filtro si lo deseas, 
    // o mostrar todos los estudiantes si ya no usas la tabla docente_grupos.
    // Por ahora, si es docente y quieres mostrarle todos o filtrarlos de otra forma:
    if (usuario && usuario.rol === 'Docente') {
      // Si deseas que vea todos los estudiantes libremente ya sin la restricción de docente_grupos:
      // (O puedes agregar lógica basada en los grupos que tenga asignados en otra parte)
    }

    const [rows] = await pool.query(query, queryParams);

    return res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo estudiante (usado por coordinador o super admin)
const crearEstudiante = async (req, res, next) => {
  try {
    const { nombre, documento, correo, carrera, grupo, periodo, fk_matricula } = req.body;

    if (!nombre || !documento || !carrera || !grupo || !periodo) {
      return res.status(400).json({ message: 'Todos los campos obligatorios del estudiante deben ser completados.' });
    }

    const matriculaFinal = fk_matricula ? parseInt(fk_matricula, 10) : 1;

    const query = `
      INSERT INTO estudiantes (nombre, documento, correo, carrera, grupo, periodo, fk_matricula) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [resultado] = await pool.query(query, [
      String(nombre).trim(),
      String(documento).trim(),
      correo ? String(correo).trim() : '',
      String(carrera).trim(),
      String(grupo).trim(),
      String(periodo).trim(),
      matriculaFinal
    ]);

    return res.status(201).json({
      message: 'Estudiante creado exitosamente.',
      id_estudiante: resultado.insertId
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'El documento o correo del estudiante ya se encuentra registrado.' });
    }
    next(error);
  }
};

// Actualizar un estudiante
const actualizarEstudiante = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, documento, correo, carrera, grupo, periodo } = req.body;

    const [existente] = await pool.query('SELECT * FROM estudiantes WHERE id_estudiante = ?', [id]);
    if (existente.length === 0) {
      return res.status(404).json({ message: 'Estudiante no encontrado.' });
    }

    const est = existente[0];
    const nuevoNombre = nombre !== undefined ? String(nombre).trim() : est.nombre;
    const nuevoDoc = documento !== undefined ? String(documento).trim() : est.documento;
    const nuevoCorreo = correo !== undefined ? (correo ? String(correo).trim() : '') : est.correo;
    const nuevaCarrera = carrera !== undefined ? String(carrera).trim() : est.carrera;
    const nuevoGrupo = grupo !== undefined ? String(grupo).trim() : est.grupo;
    const nuevoPeriodo = periodo !== undefined ? String(periodo).trim() : est.periodo;

    const query = `
      UPDATE estudiantes 
      SET nombre = ?, documento = ?, correo = ?, carrera = ?, grupo = ?, periodo = ?
      WHERE id_estudiante = ?
    `;

    await pool.query(query, [
      nuevoNombre,
      nuevoDoc,
      nuevoCorreo,
      nuevaCarrera,
      nuevoGrupo,
      nuevoPeriodo,
      id
    ]);

    return res.status(200).json({ message: 'Estudiante actualizado correctamente.' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'El documento o correo ya se encuentra registrado en otro estudiante.' });
    }
    next(error);
  }
};

// Eliminar un estudiante
const eliminarEstudiante = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [resultado] = await pool.query('DELETE FROM estudiantes WHERE id_estudiante = ?', [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: 'Estudiante no encontrado.' });
    }

    return res.status(200).json({ message: 'Estudiante eliminado correctamente.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerEstudiantes,
  crearEstudiante,
  actualizarEstudiante,
  eliminarEstudiante
};