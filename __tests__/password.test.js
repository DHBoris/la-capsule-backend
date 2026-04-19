jest.mock('nodemailer');

const request = require('supertest');
const app = require('../app');
const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const { createTestUser } = require('./helpers');

describe('Mot de passe oublié (POST /users/requestPasswordReset)', () => {
    it('envoie un email de reset et retourne result: true', async () => {
        await createTestUser({ email: 'jean.dupont@test.com' });

        const res = await request(app)
            .post('/users/requestPasswordReset')
            .send({ email: 'jean.dupont@test.com' });

        expect(res.status).toBe(200);
        expect(res.body.result).toBe(true);
        expect(res.body.message).toMatch(/e-mail/i);

        const user = await userModel.findOne({ email: 'jean.dupont@test.com' });
        expect(user.resetPasswordToken).toBeDefined();
        expect(user.resetPasswordExpires).toBeDefined();
        expect(user.resetPasswordExpires.getTime()).toBeGreaterThan(Date.now());
    });

    it('retourne result: false si l\'email n\'existe pas', async () => {
        const res = await request(app)
            .post('/users/requestPasswordReset')
            .send({ email: 'inexistant@test.com' });

        expect(res.status).toBe(200);
        expect(res.body.result).toBe(false);
        expect(res.body.message).toMatch(/non trouvé/i);
    });
});

describe('Réinitialisation de mot de passe (POST /users/resetPassword)', () => {
    it('réinitialise le mot de passe avec un token valide', async () => {
        const user = await createTestUser({ email: 'jean.dupont@test.com' });
        const resetToken = 'token-reset-valide-123';
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000);
        await user.save();

        const res = await request(app)
            .post('/users/resetPassword')
            .send({ token: resetToken, password: 'NouveauMotDePasse456!' });

        expect(res.status).toBe(200);
        expect(res.body.result).toBe(true);
        expect(res.body.message).toMatch(/réinitialisé/i);

        const updated = await userModel.findOne({ email: 'jean.dupont@test.com' });
        expect(updated.resetPasswordToken).toBeUndefined();
        expect(bcrypt.compareSync('NouveauMotDePasse456!', updated.password)).toBe(true);
    });

    it('retourne result: false avec un token invalide', async () => {
        const res = await request(app)
            .post('/users/resetPassword')
            .send({ token: 'token-bidon', password: 'NouveauMotDePasse456!' });

        expect(res.status).toBe(200);
        expect(res.body.result).toBe(false);
        expect(res.body.message).toMatch(/invalide|expiré/i);
    });

    it('retourne result: false avec un token expiré', async () => {
        const user = await createTestUser({ email: 'jean.dupont@test.com' });
        user.resetPasswordToken = 'token-expiré-123';
        user.resetPasswordExpires = new Date(Date.now() - 1000);
        await user.save();

        const res = await request(app)
            .post('/users/resetPassword')
            .send({ token: 'token-expiré-123', password: 'NouveauMotDePasse456!' });

        expect(res.status).toBe(200);
        expect(res.body.result).toBe(false);
    });
});
