
const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${err.message}`);


    const statusCode = err.statusCode || 500;


    res.status(statusCode).json({
        error: {
            message: err.message || 'Error Interno del servidor',
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        }
    });
}

module.exports = errorHandler;