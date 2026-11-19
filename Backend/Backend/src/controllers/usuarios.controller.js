const db = require('../config/db');

// Obtener todos los usuarios / profesores con su rol
const obtenerUsuarios = async (req, res, next) => {
  try {
    const query = `
      SELECT u.id_usuario, u.nombre, u.correo, u.fk_rol, r.nombre AS rol
      FROM usuarios u
      LEFT JOIN roles r ON u.fk_rol = r.id_rol
    `;
    const [usuarios] = await db.query(query);
    res.status(200).json({ success: true, data: usuarios });
  } catch (error) {
    next(error);
  }
};

// Obtener un usuario por su ID
const obtenerUsuarioPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT u.id_usuario, u.nombre, u.correo, u.fk_rol, r.nombre AS rol
      FROM usuarios u
      LEFT JOIN roles r ON u.fk_rol = r.id_rol
      WHERE u.id_usuario = ?
    `;
    const [usuarios] = await db.query(query, [id]);

    if (usuarios.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
    }

    res.status(200).json({ success: true, data: usuarios[0] });
  } catch (error) {
    next(error);
  }
};

// Actualizar datos de un usuario
const actualizarUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, correo, fk_rol } = req.body;

    await db.query(
      'UPDATE usuarios SET nombre = ?, correo = ?, fk_rol = ? WHERE id_usuario = ?',
      [nombre, correo, fk_rol, id]
    );

    res.status(200).json({ success: true, message: 'Usuario actualizado correctamente.' });
  } catch (error) {
    next(error);
  }
};

// Eliminar un usuario
const eliminarUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
    res.status(200).json({ success: true, message: 'Usuario eliminado correctamente.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario
};