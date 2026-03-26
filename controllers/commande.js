const commandeModel = require("../models/commande");

module.exports = {
    getAll(req, res) {
        commandeModel.find().then(commandes => {
            res.send(commandes);
        })
    },

    get(req, res) {
        const id = req.params.id;
        commandeModel.findById(id).then(commande => {
            res.send(commande);
        });
    }
}