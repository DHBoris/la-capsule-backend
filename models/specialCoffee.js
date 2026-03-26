const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const specialCoffeeSchema = Schema({
    specialCoffeeNumber: Number,
    topping: String,
    milk: String,
    quantity: Number,
    price: Number,
    caffeine: [{ type: Schema.Types.ObjectId, ref: 'caffeine' }],
    size: [{ type: Schema.Types.ObjectId, ref: 'size' }],
    coffeeType: String,
    deco: String,
});

const specialCoffeeModel = mongoose.model("specialCoffee", specialCoffeeSchema, "specialCoffees");
module.exports = specialCoffeeModel;