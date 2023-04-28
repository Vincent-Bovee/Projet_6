const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Utilise le mongoose-unique-validator pour valider l'email 
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);




