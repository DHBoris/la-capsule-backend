const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const coffeeTypeSchema = Schema({
    name_coffeeType: String,
    price_coffeeType: Number,
});

const coffeeTypeModel = mongoose.model("coffeeType", coffeeTypeSchema);
module.exports = coffeeTypeModel;