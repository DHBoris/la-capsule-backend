const sizeModel = require("../models/size");

module.exports = {
    getAll(req, res) {
        sizeModel.find().then(sizes => {
            res.send(sizes);
        })
    },

    get(req, res) {
        const id = req.params.id;
        sizeModel.findById(id).then(size => {
            res.send(size);
        });
    }
}