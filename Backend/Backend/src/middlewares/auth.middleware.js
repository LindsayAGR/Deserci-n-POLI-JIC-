const jwt = require('jsonwebtoken');

// Middleware para verificar que el cliente envíe un JWT válido
const verifyToken = (req, res, next) => {
  // 1. Extraer el token del encabezado 'Authorization: Bearer <TOKEN>'
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Si no envió token, se bloquea la petición
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    // 2. Verificar la validez de la firma usando la clave secreta del .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Adjuntar la información del usuario al objeto 'req' para usarla en los controladores
    req.user = decoded; 
    
    // 4. Continuar hacia la ruta solicitada
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};

// Middleware para validar roles específicos (ej: 'Administrador', 'Docente' o ['Administrador', 'Super Admin'])
const checkRole = (rolesPermitidos) => {
  const roles = Array.isArray(rolesPermitidos) ? rolesPermitidos : [rolesPermitidos];
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.rol)) {
      return res.status(403).json({ message: 'No tienes permisos para acceder a este recurso.' });
    }
    next();
  };
};

module.exports = { verifyToken, checkRole };