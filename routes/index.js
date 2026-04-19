const express = require('express');
const router = express.Router();
const { tokenVerifier } = require('../middleware/tokenVerifier');
const cartController = require('../controllers/cart');
const messageController = require('../controllers/message');
const photoController = require('../controllers/photo');
const stripeController = require('../controllers/stripeController');
const orderConfirmationController = require('../controllers/orderConfirmation');
const orderHistoryController = require('../controllers/orderHistory');


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

router.post('/cartClear', tokenVerifier, cartController.cartClear);

router.post('/message', messageController.create);

router.post('/uploadPhoto', tokenVerifier, photoController.uploadPhoto);

router.get('/loadPhoto', tokenVerifier, photoController.loadPhoto);

router.post('/create-checkout-session', tokenVerifier, stripeController.createCheckoutSession);

router.post('/order-confirmation', orderConfirmationController.sendConfirmation);

router.post('/orders/save', tokenVerifier, orderHistoryController.saveOrder);
router.get('/orders', tokenVerifier, orderHistoryController.getOrders);

module.exports = router;
