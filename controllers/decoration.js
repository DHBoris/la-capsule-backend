const decorationModel = require("../models/decoration");

module.exports = {
    getAll(req, res) {
        decorationModel.find().then(decorations => {
            res.send(decorations);
        })
    },

    get(req, res) {
        const id = req.params.id;
        decorationModel.findById(id).then(decoration => {
            res.send(decoration);
        });
    }
}