var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    email: String,
    password: String
}, { collection: 'users' });

module.exports = mongoose.model('users', userSchema);
