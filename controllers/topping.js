const toppingModel = require("../models/topping");

module.exports = {
    getAll(req, res) {
        toppingModel.find().then(toppings => {
            res.send(toppings);
        })
    },

    get(req, res) {
        const id = req.params.id;
        toppingModel.findById(id).then(topping => {
            res.send(topping);
        });
    }
}