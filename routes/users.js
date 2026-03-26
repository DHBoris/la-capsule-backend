const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const testController = require('../controllers/test');
const { tokenVerifier } = require('../middleware/tokenVerifier');

router.get('/', (req, res) => {
    res.send("bienvenue sur la page d'accueil de l'API User LaCapsule");
});

router.post('/signIn', userController.signIn);

router.post('/signUp', userController.signUp);

router.get('/verify-email', userController.verifyEmail);

router.get('/signOut', userController.signOut);

router.post('/loadProfil', tokenVerifier, userController.loadProfil);

router.post('/requestPasswordReset', userController.requestPasswordReset);

router.post('/resetPassword', userController.resetPassword);

router.put('/updateProfile', tokenVerifier, userController.updateProfile);

router.post('/test', testController.test);

module.exports = router;
