const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const alertsRouter = require('./routes/alerts');
const groupsRouter = require('./routes/groups');
const neighborsRouter = require('./routes/neighbors');
const reportsRouter = require('./routes/reports');
const connect = require('./db/dbConnection');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/alerts', alertsRouter);
app.use('/groups', groupsRouter);
app.use('/neighbors', neighborsRouter);
app.use('/reports', reportsRouter);

connect();

module.exports = app;