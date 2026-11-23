const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = require('./app');
const pool = require('./config/db');

// Configuración del puerto
const port = process.env.PORT || 4000;

// Inicialización del servidor
const server = app.listen(port, async () => {
    console.log(`=================================`);
    console.log(`Servidor logístico escuchando en el puerto: ${port}`);
    console.log(`Ambiente actual: ${process.env.NODE_ENV || 'development'}`);
    console.log(`API REST disponible en: http://localhost:${port}/api/health`);
    
    // Verificación de conexión a la Base de Datos al arrancar
    try {
        const connection = await pool.getConnection();
        console.log(`Conexión a la base de datos MySQL: EXITOSA`);
        connection.release(); // Libera la conexión de vuelta al pool
    } catch (error) {
        console.error(`Error al conectar con la base de datos MySQL: ${error.message}`);
    }
    
    console.log(`=================================`);
});

// Función de Cierre controlado de la aplicación y conexiones a BD (Graceful Shutdown)
const gracefulShutdown = async (signal) => {
    console.log(`\nRecibida señal ${signal}. Cerrando el servidor logístico...`);
    
    try {
        if (pool && pool.end) {
            await pool.end();
            console.log('Conexiones a la base de datos cerradas.');
        }
    } catch (error) {
        console.error('Error al cerrar la base de datos:', error.message);
    }

    server.close(() => {
        console.log('Proceso terminado exitosamente.');
        process.exit(0);
    });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));