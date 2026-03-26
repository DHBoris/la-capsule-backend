const milkModel = require("../models/milk");

module.exports = {
    getAll(req, res) {
        milkModel.find().then(milks => {
            res.send(milks);
        })
    },

    get(req, res) {
        const id = req.params.id;
        milkModel.findById(id).then(milk => {
            res.send(milk);
        });
    }
}