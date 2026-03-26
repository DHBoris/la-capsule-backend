const express = require('express');
const router = express.Router();
const { tokenVerifier } = require('../middleware/tokenVerifier');
const milkController = require('../controllers/milk');
const toppingController = require('../controllers/topping');
const coffeeController = require('../controllers/coffee');
const specialCoffeeController = require('../controllers/specialCoffee');
const commandeController = require('../controllers/commande');
const cartController = require('../controllers/cart');
const messageController = require('../controllers/message');
const photoController = require('../controllers/photo');
const stripeController = require('../controllers/stripeController');
const orderConfirmationController = require('../controllers/orderConfirmation');


router.get('/', (req, res) => {
    res.send("bienvenue sur la page d'accueil de l'API LaCapsule");
});

// router.get('/milks', milkController.getAll);

// router.get('/milks/:id', milkController.get);

// router.get('/toppings', toppingController.getAll);

// router.get('/toppings/:id', toppingController.get);

// router.post('/specialCoffees', specialCoffeeController.create);

// router.get('/commande', commandeController.getAll);

// router.get('/commande/:id', commandeController.get);

///////////////////déjà fait////////////////////////////////////////

router.post('/cartAdd', tokenVerifier, cartController.cartAdd);

router.post('/cartLoad', tokenVerifier, cartController.cartLoad);

router.post('/cartDelete', tokenVerifier, cartController.cartDelete);

router.post('/message', messageController.create);

router.post('/uploadPhoto', photoController.uploadPhoto);

router.get('/loadPhoto', photoController.loadPhoto);

router.post('/create-checkout-session', stripeController.createCheckoutSession);

router.post('/order-confirmation', orderConfirmationController.sendConfirmation);

module.exports = router;
