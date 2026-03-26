const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const addressSchema = Schema({
    detail_address : String,
    ville : String,
    post_code : Number,
});

const addressModel = mongoose.model('userAddress', addressSchema);

module.exports = addressModel;