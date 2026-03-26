const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const unifiedCoffeeSchema = new Schema({
    name: String,
    price: Number,
    origin: String,
    vegan: Boolean,
    quantity: Number,
    coffeeType: String,
    topping: String,
    milk: String,
    caffeine: [{ type: Schema.Types.ObjectId, ref: 'caffeine' }],
    size: [{ type: Schema.Types.ObjectId, ref: 'size' }],
    coffeeType: String,
    deco: String,
});

const unifiedCoffeeModel = mongoose.model('unifiedCoffee', unifiedCoffeeSchema);

module.exports = unifiedCoffeeModel;
