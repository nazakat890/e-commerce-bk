
class AppError extends Error {

    constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4')  ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor)
}

}

const errorHandler = (err, req, res, next) => {
        // set default value!
    let statusCode = err.statusCode || 500;
    let status = err.status || 'error';
    let message = err.message || 'Internal Server Error';

        // For non-operational errors, do not leak details to the client
    if(!err.isOperational) {
        statusCode = 500;
        message = 'Something went very wrong!';
    }

}


module.exports = { AppError, errorHandler}