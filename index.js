const express = require('express');
const server = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

// CORS module pour eviter de bloquer par CORS
const allowedOrigins = ['http://localhost:5173', 'http://localhost:4173'];

server.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

// Body-parser Pour lire JSON
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Cookie-parser Pour lire JSON
server.use(cookieParser());

const indexRoutes = require('./routes/index');
const usersRoutes = require('./routes/users');
 
server.use('/', indexRoutes);
server.use('/users', usersRoutes);

server.listen(5500, () => {
    console.log("serveur lancé et a l'ecoute sur le port 5500");

    // suppression du message de warning dans la console
    mongoose.set('strictQuery', true);

    //connexion a la base mongoDB LaCapsule
    mongoose.connect(process.env.MONGOLINK || 'mongodb://127.0.0.1:27017/LaCapsule');

    const db = mongoose.connection;
    // once -> une fois que
    db.once('open', () => {
        console.log('connexion à la base LaCapsule ok');
    }).on('error', (error) => console.error('Probleme durant la connexion a la base mongo', error));
});
