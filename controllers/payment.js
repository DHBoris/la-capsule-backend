const paymentModel = require("../models/caffeine");

module.exports = {
    getAll(req, res) {
        paymentModel.find().then(payments => {
            res.send(payments);
        })
    },

    get(req, res) {
        const id = req.params.id;
        paymentModel.findById(id).then(payment => {
            res.send(payment);
        });
    }
}