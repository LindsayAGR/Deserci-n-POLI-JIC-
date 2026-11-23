const db = require('../config/db');

// GET /api/alertas - Obtener todas las alertas ordenadas por fecha reciente
const obtenerAlertas = async (req, res, next) => {
  try {
    const query = 'SELECT * FROM alertas ORDER BY fecha DESC, id_alerta DESC';
    const [alertas] = await db.query(query);
    res.status(200).json({ success: true, data: alertas });
  } catch (error) {
    next(error);
  }
};

// POST /api/alertas - Crear una alerta
const crearAlerta = async (req, res, next) => {
  try {
    const { tipo, descripcion, fk_usuario, fecha } = req.body;

    if (!tipo || !descripcion || !fk_usuario) {
      return res.status(400).json({ 
        success: false, 
        message: 'El tipo, la descripción y el usuario son obligatorios.' 
      });
    }

    const fechaFinal = fecha || new Date().toISOString().slice(0, 19).replace('T', ' ');

    const query = 'INSERT INTO alertas (tipo, descripcion, fecha, fk_usuario) VALUES (?, ?, ?, ?)';
    await db.query(query, [tipo, descripcion, fechaFinal, fk_usuario]);

    res.status(201).json({ success: true, message: 'Alerta registrada correctamente.' });
  } catch (error) {
    next(error);
  }
};

// PUT /api/alertas/:id - Actualizar una alerta
const actualizarAlerta = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tipo, descripcion } = req.body;

    const [existente] = await db.query('SELECT * FROM alertas WHERE id_alerta = ?', [id]);
    if (existente.length === 0) {
      return res.status(404).json({ success: false, message: 'Alerta no encontrada.' });
    }

    const alerta = existente[0];
    const nuevoTipo = tipo !== undefined ? String(tipo).trim() : alerta.tipo;
    const nuevaDesc = descripcion !== undefined ? String(descripcion).trim() : alerta.descripcion;

    const query = 'UPDATE alertas SET tipo = ?, descripcion = ? WHERE id_alerta = ?';
    await db.query(query, [nuevoTipo, nuevaDesc, id]);

    res.status(200).json({ success: true, message: 'Alerta actualizada correctamente.' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/alertas/:id - Eliminar una alerta
const eliminarAlerta = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [resultado] = await db.query('DELETE FROM alertas WHERE id_alerta = ?', [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Alerta no encontrada.' });
    }

    res.status(200).json({ success: true, message: 'Alerta eliminada correctamente.' });
  } catch (error) {
    next(error);
  }
};

// EXPORTAR TODAS LAS FUNCIONES DECLARADAS
module.exports = {
  obtenerAlertas,
  crearAlerta,
  actualizarAlerta,
  eliminarAlerta
};