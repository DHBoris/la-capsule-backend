const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const photoSchema = Schema({
    url: String,
    filters: Object
});

const photoModel = mongoose.model('photo', photoSchema);

module.exports = photoModel;
