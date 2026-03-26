const coffeeModel = require('../models/coffee');

module.exports = {
    addCoffee: async (req, res) => {
        const { id, name, origin, vegan, type, caffeine, size, price, quantity } = req.body;

        try {
            let coffeeExist = await coffeeModel.findOne({ id: id });

            if (coffeeExist) {
                return res.json({
                    result: false,
                });
            } else {
                const newCoffee = new coffeeModel({
                    id: id,
                    name: name,
                    origin: origin,
                    vegan: vegan,
                    type: type,
                    caffeine: caffeine,
                    size: size,
                    price: price * quantity,
                    quantity: quantity,
                });

                const coffeeSaved = newCoffee.save();

                if (coffeeSaved) {
                    console.log(coffeeSaved);
                    console.log('Coffee est bien enregistré');
                    return res.json({ result: true });
                }
            }
        } catch (error) {
            'Error: ' + error;
        }
    },
};
