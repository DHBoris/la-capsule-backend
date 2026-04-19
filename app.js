const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const allowedOrigins = ['http://localhost:5173', 'http://localhost:4173'];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const indexRoutes = require('./routes/index');
const usersRoutes = require('./routes/users');
app.use('/', indexRoutes);
app.use('/users', usersRoutes);

module.exports = app;
