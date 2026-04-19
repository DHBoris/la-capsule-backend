jest.mock('nodemailer');

const request = require('supertest');
const app = require('../app');
const userModel = require('../models/user');
const { createTestUser, generateAccessToken, generateRefreshToken, generateExpiredToken } = require('./helpers');

describe('Middleware JWT (tokenVerifier)', () => {
    it('laisse passer avec un access token valide', async () => {
        const user = await createTestUser({ email: 'jean.dupont@test.com' });
        const token = generateAccessToken(user.email);

        const res = await request(app)
            .post('/users/loadProfil')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.result).toBe(true);
    });

    it('retourne 401 si aucun header Authorization', async () => {
        const res = await request(app).post('/users/loadProfil');
        expect(res.status).toBe(401);
    });

    it('retourne 401 si le header ne commence pas par Bearer', async () => {
        const res = await request(app)
            .post('/users/loadProfil')
            .set('Authorization', 'Basic dXNlcjpwYXNz');
        expect(res.status).toBe(401);
    });

    it('rafraîchit automatiquement avec un refresh token valide si l\'access token est expiré', async () => {
        const user = await createTestUser({ email: 'jean.dupont@test.com' });
        const expiredToken = generateExpiredToken(user.email);
        const refreshToken = generateRefreshToken(user.email);

        await userModel.findOneAndUpdate(
            { email: user.email },
            { refreshToken: refreshToken }
        );

        const res = await request(app)
            .post('/users/loadProfil')
            .set('Authorization', `Bearer ${expiredToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`);

        expect(res.status).toBe(200);
        expect(res.body.result).toBe(true);
        expect(res.body.accessToken).toBeDefined();
    });

    it('retourne 401 si access token expiré et pas de refresh token', async () => {
        const expiredToken = generateExpiredToken('jean.dupont@test.com');

        const res = await request(app)
            .post('/users/loadProfil')
            .set('Authorization', `Bearer ${expiredToken}`);

        expect(res.status).toBe(401);
    });

    it('retourne 400 si les deux tokens sont invalides', async () => {
        const res = await request(app)
            .post('/users/loadProfil')
            .set('Authorization', 'Bearer token.invalide.bidon')
            .set('Cookie', 'refreshToken=refresh.invalide.bidon');

        expect(res.status).toBe(400);
    });
});
