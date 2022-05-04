//importation des packages mongoose
const mongoose = require("mongoose");
// importation du package mongoose uniquevalidator permettant d"avoir un email unique
const uniqueValidator = require("mongoose-unique-validator");

//schema utilisateur
const userSchema = mongoose.Schema({
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);