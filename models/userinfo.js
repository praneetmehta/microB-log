var mongoose = require('mongoose');

var userInfoSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    firstname: String,
    lastname: String,
    email: String,
    hostel: String,
    room: Number,
    contact: Number
}, {
    collection: 'userinfo'
});

module.exports = mongoose.model('userinfo', userInfoSchema);
