const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cartSchema = Schema({
    id: Number,
    name: String,
    origin: String,
    image: String,
    vegan: Boolean,
    type: String,
    caffeine: Boolean,
    size: Number,
    price: Number,
    quantity: Number
});

const cartModel = mongoose.model('cart', cartSchema);

module.exports = cartModel;
