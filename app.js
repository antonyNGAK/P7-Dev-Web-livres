
const express = require ('express');
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose');
const mongoSanitize = require('express-mongo-sanitize');



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
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
//connection à la base de donnée mongoDB
mongoose.connect ('mongodb+srv://anto:boNjour1@cluster0.zf09ttp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',{
        useNewUrlParser: true,
        useUnifiedTopology: true})
    .then(() => console.log('connexion à la base de données réussi!'))
    .catch(() => console.log('Echec de connexion à la base de données!'));

app.use(express.json());

app.use(mongoSanitize({
    replaceWith: '_',
}));

app.use('/api/', limiter);


//liens des différentes routes
app.use('/api/books', booksRoutes);
app.use('/api/auth', userRoutes);
app.use('pictures', express.static(path.join(__dirname, 'pictures')));

module.exports = app;
