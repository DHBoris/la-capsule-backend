const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const decorationSchema = Schema({
    name_decoration: String,
    price_decoration: Number,
});

const decorationModel = mongoose.model("decoration", decorationSchema);
module.exports = decorationModel;