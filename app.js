const express = require ('express');
const mongoose = require ('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();



//Routage
const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/user');
const rateLimit = require('express-rate-limit');

//Déclaration de l'app express
const app = express();

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 100, 
    standardHeaders: true, 
    legacyHeaders: false, 
})

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    //res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//connection à la base de donnée mongoDB

mongoose.connect (process.env.URL_DB)

    .then(() => console.log('connexion à la base de données réussi!'))
    .catch(() => console.log('Echec de connexion à la base de données!'));

app.use(express.json());

//gestion des espaces
app.use(mongoSanitize({
    replaceWith: '_',
}));

app.use(helmet({
    xDownloadOptions: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
}));

app.use('/api/', limiter);


//liens des différentes routes
app.use('/api/books', booksRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
