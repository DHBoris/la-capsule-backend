const userAddressModel = require('../models/userAddress');

module.exports = {
    getAll(req, res) {
        userAddressModel.find().then(usersAddress => {
            res.send(usersAddress);
        })
    },

    get(req, res) {
        const id = req.params.id;
        userAddressModel.findById(id).then(userAddress => {
            res.send(userAddress);
        });
    }
}