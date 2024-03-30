const jwt = require('jsonwebtoken');
require('dotenv').config();

//Logique pour le token et récupération des autorisation et d'éventuelles erreurs

module.exports = (req, res, next) => {
    try {
        //Récupération des autorisations du header 
    
        const token = req.headers.authorization.split(' ')[1];
        
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY); //Déchiffrage du Token
        
        //Capter l'Identifiant le sauvegarder et renvoyer une erreur en cas d'absence

        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        res.status(403).json({ error });
    }
};