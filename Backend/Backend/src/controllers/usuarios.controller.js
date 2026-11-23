const db = require('../config/db');

// Obtener todos los usuarios / profesores con su rol
const obtenerUsuarios = async (req, res, next) => {
  try {
    const query = `
      SELECT u.id_usuario, u.nombre, u.correo, u.documento, u.fk_rol, r.nombre AS rol
      FROM usuarios u
      LEFT JOIN roles r ON u.fk_rol = r.id_rol
      ORDER BY u.id_usuario ASC
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
      SELECT u.id_usuario, u.nombre, u.correo, u.documento, u.fk_rol, r.nombre AS rol
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
    const { nombre, correo, documento, fk_rol } = req.body;

    const [usuarioActual] = await db.query('SELECT id_usuario, nombre, correo, documento, fk_rol FROM usuarios WHERE id_usuario = ?', [id]);
    if (usuarioActual.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
    }

    const actual = usuarioActual[0];

    // Regla de seguridad: solo Super Admin puede modificar o asignar cuentas de Super Admin (rol 3)
    const nuevoRol = fk_rol !== undefined ? parseInt(fk_rol, 10) : actual.fk_rol;
    if (req.user && req.user.rol !== 'Super Admin') {
      if (actual.fk_rol === 3 || nuevoRol === 3) {
        return res.status(403).json({ success: false, message: 'Solo un Super Admin puede gestionar cuentas de Super Admin.' });
      }
    }

    const nuevoNombre = nombre !== undefined ? String(nombre).trim() : actual.nombre;
    const nuevoCorreo = correo !== undefined ? String(correo).trim() : actual.correo;
    const nuevoDoc = documento !== undefined ? (documento ? String(documento).trim() : null) : actual.documento;

    await db.query(
      'UPDATE usuarios SET nombre = ?, correo = ?, documento = ?, fk_rol = ? WHERE id_usuario = ?',
      [nuevoNombre, nuevoCorreo, nuevoDoc, nuevoRol, id]
    );

    res.status(200).json({ success: true, message: 'Usuario actualizado correctamente.' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'El correo o documento ya se encuentra registrado.' });
    }
    next(error);
  }
};

// Eliminar un usuario
const eliminarUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Regla de seguridad: prevenir auto-eliminación accidental
    if (req.user && String(req.user.id) === String(id)) {
      return res.status(400).json({ success: false, message: 'No puedes eliminar tu propia cuenta en sesión.' });
    }

    const [usuario] = await db.query('SELECT id_usuario, fk_rol FROM usuarios WHERE id_usuario = ?', [id]);
    if (usuario.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
    }

    // Regla de seguridad: solo Super Admin puede eliminar a otro Super Admin
    if (usuario[0].fk_rol === 3 && req.user.rol !== 'Super Admin') {
      return res.status(403).json({ success: false, message: 'Solo un Super Admin puede eliminar a otro Super Admin.' });
    }

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