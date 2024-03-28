
const express = require ('express')
const mongoose = require ('mongoose');



//Routage
//const booksRoutes = require('./routes/books');
//const usersRoutes = require('./routes/user');

//Déclaration de l'app express
const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
//connection à la base de donnée mongoDB
mongoose.connect ('mongodb+srv://antonyngakosso63 :boNjour1@cluster0.zf09ttp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',{
        useNewUrlParset: true,
        useUnifiedTopolgy: true
    })
    .then(() => console.log('connexion à la base de données réussi!'))
    .catch(() => console.log('Echec de connexion à la base de données!'));

app.use(express.json());



module.exports = app;
