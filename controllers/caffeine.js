const caffeineModel = require("../models/caffeine");

module.exports = {
    getAll(req, res) {
        caffeineModel.find().then(caffeines => {
            res.send(caffeines);
        })
    },

    get(req, res) {
        const id = req.params.id;
        caffeineModel.findById(id).then(caffeine => {
            res.send(caffeine);
        });
    }
}