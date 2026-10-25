const errorHandler = (err, req, res, next) => {

    if (err.code === 11000) {
        return res.status(409).json({
            success: false,
            error: {
                code: 'DUPLICATE_EMAIL',
                message: 'Ya existe un usuario con ese email'
            }
        });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            error: {
                code: 'INVALID_ID',
                message: 'ID no válido'
            }
        });
    }

    const status = err.status || 500;

    res.status(status).json({
        success: false,
        error: {
            code: err.code || 'INTERNAL_SERVER_ERROR',
            message: err.message || 'Error inesperado',
            details: err.details || []
        }
    });

};

module.exports = errorHandler;