const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/User');

exports.signup = (req, res, next) => {
    const { email, password } = req.body;

    //Vérification de l'email

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (emailRegex.test(email) === false) {
        return res.status(400).json({ message: 'Email non valide' });
    };

    if (password.length < 5) {  //Vérification des caractère du mot de passe

        return res.status(400).json({ message: 'Le mot de passe doit avoir au moins 5 caractères !' });
    }

    //Création d'un nouvel utilisateurs après le hashage du mot de passe

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
//Logique de connexion avec méthode de cryptage
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user === null) {
                res.status(401).json({ message: 'Informations de connexion incorrectes !' })
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            res.status(401).json({ message: 'Informations de connexion incorrectes !' })
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id },
                                    process.env.KEY_SECRET,
                                    { expiresIn: '24h' },
                                )
                            });
                        }
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));

};