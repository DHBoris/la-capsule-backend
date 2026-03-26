const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const coffeeSchema = Schema({
    id: String,
    name: String,
    origin: String,
    vegan: Boolean,
    type: String,
    caffeine: Boolean,
    size: Number,
    price: Number,
    quantity: Number,
});

const coffeeModel = mongoose.model("coffee", coffeeSchema);
module.exports = coffeeModel;