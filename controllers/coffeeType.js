const coffeeTypeModel = require("../models/coffeeType");

module.exports = {
    getAll(req, res) {
        coffeeTypeModel.find().then(coffeeTypes => {
            res.send(coffeeTypes);
        })
    },

    get(req, res) {
        const id = req.params.id;
        coffeeTypeModel.findById(id).then(coffeeType => {
            res.send(coffeeType);
        });
    }
}