const express = require('express');
const cors = require('cors'); //4.5k (gzipped: 1.9k)
const helmet = require('helmet'); // 12.6k (gzipped: 3.3k)
const morgan = require('morgan'); //16k (gzipped: 5.8k)

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

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        success: true,
        message: 'Servidor logistico funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

app.use(express.json());

// 3. Rutas de la API REST
app.use('/api/auth', authRoutes);                              // Público
app.use('/api/usuarios', verifyToken, usuariosRoutes);          // Protegido
app.use('/api/estudiantes', verifyToken, estudiantesRoutes);    // Protegido
app.use('/api/materias', verifyToken, materiasRoutes);          // Protegido
app.use('/api/alertas', verifyToken, alertasRoutes);            // Protegido
app.use('/api/reportes', verifyToken, reportesRoutes);          // Protegido
app.use('/api/asistencias', asistenciasRoutes)

// Middleware global de manejo de errores
app.use(errorHandler);

module.exports = app;