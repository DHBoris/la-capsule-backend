const cartModel = require('../models/cart');
const userModel = require('../models/user');

module.exports = {
    cartAdd: async (req, res) => {
        const { id, name, origin, image, vegan, type, caffeine, size, price, quantity } = req.body;
        const userInfo = res.locals.userInfo;

        try {
            const foundUser = await userModel.findOne({ email: userInfo });

            if (foundUser) {
                const newCartProduct = new cartModel({
                    id: id,
                    name: name,
                    origin: origin,
                    image: image,
                    vegan: vegan,
                    type: type,
                    caffeine: caffeine,
                    size: size,
                    price: price,
                    quantity: quantity
                });

                const cartSaved = await newCartProduct.save();
                foundUser.cartList.push(cartSaved._id);

                await foundUser.save();
                console.log(cartSaved);
                console.log('Produit est bien enregistré au panier');
                return res.json({ result: true });
            } else {
                return res.json({ result: false });
            }
        } catch (error) {
            return res.status(500).json({ result: false, error: error.message });
        }
    },
    cartLoad: async (req, res) => {
        const userInfo = res.locals.userInfo;

        try {
            const foundUser = await userModel.findOne({ email: userInfo }).populate('cartList');
            console.log(foundUser.cartList);

            if (!foundUser) {
                console.log('User not found');
                return res.json({ result: false });
            }

            if (!foundUser.cartList) {
                console.log('Cart list not found');
                return res.json({ result: false });
            }
            return res.json({ result: true, cartList: foundUser.cartList });
        } catch (error) {
            return res.status(500).json({ result: false, error: error.message });
        }
    },
    cartDelete: async (req, res) => {
        const product = req.body.id
        console.log(product);
        try {
            const foundProduct = await cartModel.findOneAndDelete({ id: product });

            if (!foundProduct) {
                console.log('Product not found');
                return res.json({ result: false });
            }

            return res.json({ result: true });
        } catch (error) {
            return res.status(500).json({ result: false, error: error.message });
        }
    }
};
