const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = Schema({
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
    password: String,
    day: Number,
    month: Number,
    year: Number,
    politique: Boolean,
    abonnement: Boolean,
    userAddress: [{ type: Schema.Types.ObjectId, ref: 'userAddress' }],
    cartList: [{ type: Schema.Types.ObjectId, ref: 'cart' }],
    isVerified: { type: Boolean, default: false },
    emailToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    refreshToken: String
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
