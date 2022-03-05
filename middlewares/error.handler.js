const boom = require('@hapi/boom');

//Middleware to log errors in console
function logErrors (err, req, res, next) {
  console.log(err);
  next(err);
}

//Middleware to send errors to client
function errorHandler(err, req, res, next) {
  res.status(500).json({
    status: 'failed',
    msg: 'Internal Server Error'
  });
  return;
}

//Middleware to handle boom errors
function boomErrorHandler(err, req, res, next) {
  if (err.isBoom) {

    const { output } = err;
    res.status(output.statusCode).json(output.payload);
    return;
  }
  next(err);
}

module.exports = { logErrors, errorHandler, boomErrorHandler }
