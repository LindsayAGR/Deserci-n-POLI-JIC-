const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ROL_ADMIN = 'Administrador';
const ROL_SUPER = 'Super Admin';

// Correos autorizados como Super Admin (rol 3)
const SUPER_ADMINS = [
  'lindsay_garcia82251@elpoli.edu.co',
  'kevin_durango82251@elpoli.edu.co'
];

// /register es una ruta pública, pero si viene un token sabemos quién crea la cuenta.
const quienLlama = (req) => {
  const header = req.headers['authorization'];
  const token = header && header.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return null;
  }
};

// 1. Inicio de sesión (Login)
const login = async (req, res, next) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({
        message: 'El correo y la contraseña son obligatorios.'
      });
    }

    const query = `
      SELECT u.id_usuario, u.nombre, u.correo, u.contrasena, r.nombre AS rol
      FROM usuarios u
      LEFT JOIN roles r ON u.fk_rol = r.id_rol
      WHERE u.correo = ?
    `;
    const [rows] = await pool.query(query, [correo]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const usuario = rows[0];

    const esPasswordValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esPasswordValida) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const token = jwt.sign(
      { id: usuario.id_usuario, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token: token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });

  } catch (error) {
    next(error);
  }
};

// 2. Registro de nuevos usuarios (desde la app o formulario)
const register = async (req, res, next) => {
  try {
    const { nombre, correo, contrasena, fk_rol, documento } = req.body;

    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({ message: 'El nombre, correo y contraseña son obligatorios.' });
    }
    if (String(contrasena).length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' });
    }
    const doc = documento ? String(documento).trim() : null;

    // Verificar si el correo o el documento ya existen en la base de datos
    const [existingUser] = await pool.query(
      'SELECT id_usuario FROM usuarios WHERE correo = ? OR (documento IS NOT NULL AND documento = ?)',
      [correo, doc]
    );
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'El correo o el documento ya está registrado.' });
    }

    const quien = quienLlama(req);
    const esSuperAdmin = SUPER_ADMINS.some(
      (adminEmail) => adminEmail.toLowerCase().trim() === String(correo).toLowerCase().trim()
    );
    const pedido = parseInt(fk_rol, 10);

    let rolDefinitivo = 2; // Por defecto Docente
    if (esSuperAdmin) {
      rolDefinitivo = 3;
    } else if (quien && quien.rol === ROL_SUPER && [1, 2].includes(pedido)) {
      rolDefinitivo = pedido;
    }

    const hashedPassword = await bcrypt.hash(String(contrasena), 10);

    await pool.query(
      'INSERT INTO usuarios (nombre, correo, contrasena, documento, fk_rol) VALUES (?, ?, ?, ?, ?)',
      [String(nombre).trim(), String(correo).trim(), hashedPassword, doc, rolDefinitivo]
    );

    return res.status(201).json({ message: 'Usuario registrado exitosamente.' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'El correo o el documento ya está registrado.' });
    }
    next(error);
  }
};

// 3. Cambiar la contraseña propia
const cambiarPassword = async (req, res, next) => {
  try {
    const { contrasena_actual, contrasena_nueva } = req.body;

    if (!contrasena_actual || !contrasena_nueva) {
      return res.status(400).json({ message: 'Debes enviar la contraseña actual y la nueva.' });
    }
    if (String(contrasena_nueva).length < 6) {
      return res.status(400).json({ message: 'La contraseña nueva debe tener al menos 6 caracteres.' });
    }
    if (contrasena_actual === contrasena_nueva) {
      return res.status(400).json({ message: 'La contraseña nueva debe ser distinta de la actual.' });
    }

    const [rows] = await pool.query('SELECT contrasena FROM usuarios WHERE id_usuario = ?', [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const coincide = await bcrypt.compare(contrasena_actual, rows[0].contrasena);
    if (!coincide) {
      return res.status(401).json({ message: 'La contraseña actual no es correcta.' });
    }

    const hash = await bcrypt.hash(String(contrasena_nueva), 10);
    await pool.query('UPDATE usuarios SET contrasena = ? WHERE id_usuario = ?', [hash, req.user.id]);

    return res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, register, cambiarPassword };


