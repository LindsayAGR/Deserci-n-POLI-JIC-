const db = require('../config/db');

// GET /api/alertas - Obtener todas las alertas
const obtenerAlertas = async (req, res, next) => {
  try {
    const query = 'SELECT * FROM alertas';
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

    const query = 'UPDATE alertas SET tipo = ?, descripcion = ? WHERE id_alerta = ?';
    await db.query(query, [tipo, descripcion, id]);

    res.status(200).json({ success: true, message: 'Alerta actualizada correctamente.' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/alertas/:id - Eliminar una alerta
const eliminarAlerta = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM alertas WHERE id_alerta = ?', [id]);
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