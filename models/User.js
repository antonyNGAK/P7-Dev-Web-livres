const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Décla de userSchema avec la méthode mongoose de validation unique de l'email

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);