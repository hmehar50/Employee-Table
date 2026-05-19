import logger from '../config/logger.js'

export const handleError = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || err.message;
    logger.error(status, message);
    res.status(status).json({
        success: false,
        message ,
        ...(process.env.NODE_ENV === 'development' && {error : err}),
    });
};

export const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route Not Found',
    });
};

