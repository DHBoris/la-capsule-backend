const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sizeSchema = Schema({
    name_size: String,
    price_size : Number,
});

const sizeModel = mongoose.model("size", sizeSchema);
module.exports = sizeModel;