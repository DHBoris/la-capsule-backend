const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const paymentSchema = Schema({
    payment_method : String,
    userId : [{type : Schema.Types.ObjectId, ref : 'user'}],
});

const paymentModel = mongoose.model('payment', paymentSchema);

module.exports = paymentModel;
