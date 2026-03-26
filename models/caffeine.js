const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const caffeineSchema = Schema({
    name_caffeine: String,
    price_caffeine: Number,
});

const caffeineModel = mongoose.model("caffeine", caffeineSchema);
module.exports = caffeineModel;