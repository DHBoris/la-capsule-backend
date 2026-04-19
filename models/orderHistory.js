const mongoose = require('mongoose');

const orderHistorySchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    items: [{
        name: String,
        image: String,
        price: Number,
        quantity: Number,
    }],
    total: { type: Number, required: true },
    stripeRef: { type: String },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('OrderHistory', orderHistorySchema);
