const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = Schema({
    firstName: String,
    lastName: String,
    email: String,
    callNumber: Number,
    message: String,
    politique: Boolean,
});

const messageModel = mongoose.model('message', messageSchema);

module.exports = messageModel;
