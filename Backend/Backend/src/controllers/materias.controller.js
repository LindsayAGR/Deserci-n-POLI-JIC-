const db = require('../config/db');

// GET /api/materias - Obtener todas las materias
const obtenerMaterias = async (req, res, next) => {
  try {
    const query = 'SELECT * FROM materias';
    const [materias] = await db.query(query);
    res.status(200).json({ success: true, data: materias });
  } catch (error) {
    next(error);
  }
};

// GET /api/materias/:id - Obtener una materia por ID
const obtenerMateriaPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM materias WHERE id_materia = ?';
    const [materias] = await db.query(query, [id]);

    if (materias.length === 0) {
      return res.status(404).json({ success: false, message: 'Materia no encontrada.' });
    }

    res.status(200).json({ success: true, data: materias[0] });
  } catch (error) {
    next(error);
  }
};

// POST /api/materias - Crear una nueva materia
const crearMateria = async (req, res, next) => {
  try {
    const { nombre, codigo, creditos, fk_usuario } = req.body;

    // Validar campos obligatorios básicos
    if (!nombre || !codigo) {
      return res.status(400).json({ success: false, message: 'El nombre y el código son obligatorios.' });
    }

    // Evita el Error 500 en MySQL asignando '3' por defecto si creditos no se envió
    const creditosFinal = creditos || '3';

    const query = 'INSERT INTO materias (nombre, codigo, creditos, fk_usuario) VALUES (?, ?, ?, ?)';
    await db.query(query, [nombre, codigo, creditosFinal, fk_usuario || null]);

    res.status(201).json({ success: true, message: 'Materia registrada correctamente.' });
  } catch (error) {
    next(error);
  }
};

// PUT /api/materias/:id - Actualizar una materia
const actualizarMateria = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, codigo, creditos, fk_usuario } = req.body;

    const creditosFinal = creditos || '3';

    const query = 'UPDATE materias SET nombre = ?, codigo = ?, creditos = ?, fk_usuario = ? WHERE id_materia = ?';
    await db.query(query, [nombre, codigo, creditosFinal, fk_usuario || null, id]);

    res.status(200).json({ success: true, message: 'Materia actualizada correctamente.' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/materias/:id - Eliminar una materia
const eliminarMateria = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM materias WHERE id_materia = ?', [id]);
    res.status(200).json({ success: true, message: 'Materia eliminada correctamente.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerMaterias,
  obtenerMateriaPorId,
  crearMateria,
  actualizarMateria,
  eliminarMateria
};