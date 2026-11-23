const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// 1. Importación de Rutas
const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const estudiantesRoutes = require('./routes/estudiantes.routes');
const materiasRoutes = require('./routes/materias.routes');
const alertasRoutes = require('./routes/alertas.routes');
const reportesRoutes = require('./routes/reportes.routes');
const asistenciasRoutes = require('./routes/asistencias.routes');

// 2. Importación de Middlewares
const { verifyToken } = require('./middlewares/auth.middleware');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Configuración de cabeceras de seguridad y logging
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Procesamiento de payloads JSON y URL-encoded (única declaración)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Resolución segura de la carpeta de frontend (compatible con Render, local y despliegues anidados)
const frontendPath = fs.existsSync(path.join(__dirname, '../frontend'))
  ? path.join(__dirname, '../frontend')
  : path.join(__dirname, '../../frontend');

// Servido de archivos estáticos
app.use(express.static(frontendPath, {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0
}));

// Endpoint de monitoreo de salud del backend
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        success: true,
        message: 'Servidor logistico funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// 3. Rutas de la API REST
app.use('/api/auth', authRoutes);                              // Rutas públicas de autenticación
app.use('/api/usuarios', verifyToken, usuariosRoutes);          // Protegido con JWT
app.use('/api/estudiantes', verifyToken, estudiantesRoutes);    // Protegido con JWT
app.use('/api/materias', verifyToken, materiasRoutes);          // Protegido con JWT
app.use('/api/alertas', verifyToken, alertasRoutes);            // Protegido con JWT
app.use('/api/reportes', verifyToken, reportesRoutes);          // Protegido con JWT
app.use('/api/asistencias', verifyToken, asistenciasRoutes);    // Protegido con JWT

// 4. Fallback para vistas HTML del Frontend (compatible con Express v5)
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'landing.html'));
});

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'Ruta API no encontrada.' });
  }
  const requestedFile = path.join(frontendPath, req.path);
  if (fs.existsSync(requestedFile) && fs.statSync(requestedFile).isFile()) {
    return res.sendFile(requestedFile);
  }
  res.sendFile(path.join(frontendPath, 'landing.html'));
});

// Middleware global de manejo de errores
app.use(errorHandler);

module.exports = app;