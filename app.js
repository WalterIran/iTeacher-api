const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { logErrors, errorHandler, boomErrorHandler } = require('./middlewares/error.handler');
const {passport} = require('./config/jwt.strategy');

const indexRouter = require('./routes/index');

const app = express();
app.use(passport.initialize());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

//Error handling middlewares
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

app.use('*', function(req, res){
    res.status(404).json({status: 'failed', msg: "Route not found"});
});

module.exports = app;
