const mongoose = require('mongoose');
const app = require('./app');

app.listen(5500, () => {
    console.log("serveur lancé et a l'ecoute sur le port 5500");

    mongoose.set('strictQuery', true);
    mongoose.connect(process.env.MONGOLINK || 'mongodb://127.0.0.1:27017/LaCapsule');

    const db = mongoose.connection;
    db.once('open', () => {
        console.log('connexion à la base LaCapsule ok');
    }).on('error', (error) => console.error('Probleme durant la connexion a la base mongo', error));
});
