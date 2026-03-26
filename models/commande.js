const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commandeSchema = Schema({
    //TODO:  implementation des commandLines
    // TODO: user attaché a cette commande
   status: String,
   total_price: Number,
   total_quantity : Number,
   date: Date,
   order_status : String,
   stripe_ref : String,
   recipe : String,
   userId : [{type : Schema.Types.ObjectId, ref : 'user'}],
   address_id : [{type : Schema.Types.ObjectId, ref : 'address'}],
   product_number : [{type : Schema.Types.ObjectId, ref: 'coffee'}],
   specialCoffee_id : [{type : Schema.Types.ObjectId, ref : 'specialCoffee'}],
});

const commandeModel = mongoose.model("commande", commandeSchema);
module.exports = commandeModel;