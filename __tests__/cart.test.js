jest.mock('nodemailer');

const request = require('supertest');
const app = require('../app');
const cartModel = require('../models/cart');
const userModel = require('../models/user');
const { createTestUser, generateAccessToken } = require('./helpers');

const cartItemPayload = {
    id: 1,
    name: 'Espresso Éthiopien',
    origin: 'Éthiopie',
    image: 'https://example.com/espresso.jpg',
    vegan: true,
    type: 'arabica',
    caffeine: true,
    size: 250,
    price: 4.5,
    quantity: 2,
};

describe('Panier — Ajout (POST /cartAdd)', () => {
    it('ajoute un produit au panier de l\'utilisateur connecté', async () => {
        const user = await createTestUser({ email: 'jean.dupont@test.com' });
        const token = generateAccessToken(user.email);

        const res = await request(app)
            .post('/cartAdd')
            .set('Authorization', `Bearer ${token}`)
            .send(cartItemPayload);

        expect(res.status).toBe(200);
        expect(res.body.result).toBe(true);

        const cartItem = await cartModel.findOne({ id: cartItemPayload.id });
        expect(cartItem).not.toBeNull();
        expect(cartItem.name).toBe(cartItemPayload.name);

        const updatedUser = await userModel.findOne({ email: user.email });
        expect(updatedUser.cartList).toHaveLength(1);
    });

    it('retourne 401 sans token', async () => {
        const res = await request(app).post('/cartAdd').send(cartItemPayload);
        expect(res.status).toBe(401);
    });
});

describe('Panier — Chargement (POST /cartLoad)', () => {
    it('retourne la liste des produits du panier', async () => {
        const user = await createTestUser({ email: 'jean.dupont@test.com' });
        const token = generateAccessToken(user.email);

        await request(app)
            .post('/cartAdd')
            .set('Authorization', `Bearer ${token}`)
            .send(cartItemPayload);

        const res = await request(app)
            .post('/cartLoad')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.result).toBe(true);
        expect(res.body.cartList).toHaveLength(1);
        expect(res.body.cartList[0].name).toBe(cartItemPayload.name);
    });

    it('retourne un panier vide pour un nouvel utilisateur', async () => {
        const user = await createTestUser({ email: 'jean.dupont@test.com' });
        const token = generateAccessToken(user.email);

        const res = await request(app)
            .post('/cartLoad')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.result).toBe(true);
        expect(res.body.cartList).toHaveLength(0);
    });

    it('retourne 401 sans token', async () => {
        const res = await request(app).post('/cartLoad');
        expect(res.status).toBe(401);
    });
});

describe('Panier — Suppression (POST /cartDelete)', () => {
    it('supprime un produit du panier et nettoie la référence dans l\'utilisateur', async () => {
        const user = await createTestUser({ email: 'jean.dupont@test.com' });
        const token = generateAccessToken(user.email);

        await request(app)
            .post('/cartAdd')
            .set('Authorization', `Bearer ${token}`)
            .send(cartItemPayload);

        const res = await request(app)
            .post('/cartDelete')
            .set('Authorization', `Bearer ${token}`)
            .send({ id: cartItemPayload.id });

        expect(res.status).toBe(200);
        expect(res.body.result).toBe(true);

        const deletedItem = await cartModel.findOne({ id: cartItemPayload.id });
        expect(deletedItem).toBeNull();

        const updatedUser = await userModel.findOne({ email: user.email });
        expect(updatedUser.cartList).toHaveLength(0);
    });

    it('retourne result: false si le produit n\'existe pas', async () => {
        const user = await createTestUser({ email: 'jean.dupont@test.com' });
        const token = generateAccessToken(user.email);

        const res = await request(app)
            .post('/cartDelete')
            .set('Authorization', `Bearer ${token}`)
            .send({ id: 9999 });

        expect(res.status).toBe(200);
        expect(res.body.result).toBe(false);
    });

    it('retourne 401 sans token', async () => {
        const res = await request(app).post('/cartDelete').send({ id: 1 });
        expect(res.status).toBe(401);
    });
});
