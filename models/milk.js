const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const milkSchema = Schema({
    name_milk: String,
    price_milk: Number,
});

const milkModel = mongoose.model("milk", milkSchema);
module.exports = milkModel;