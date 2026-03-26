const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const toppingSchema = Schema({
    name_topping: String,
    price_topping: Number,
});

const toppingModel = mongoose.model("topping", toppingSchema);
module.exports = toppingModel;