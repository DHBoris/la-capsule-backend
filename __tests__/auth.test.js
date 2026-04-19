jest.mock('nodemailer');

const request = require('supertest');
const app = require('../app');
const userModel = require('../models/user');
const { createTestUser, generateAccessToken } = require('./helpers');

describe('Auth — Inscription (POST /users/signUp)', () => {
    const validPayload = {
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'marie.martin@test.com',
        phoneNumber: '0612345678',
        password: 'MotDePasse123!',
        day: 15,
        month: 3,
        year: 1995,
        politique: true,
        abonnement: false,
        detail_address: '5 avenue Victor Hugo',
        post_code: '69001',
        ville: 'Lyon',
    };

    it('crée un nouvel utilisateur et retourne result: true', async () => {
        const res = await request(app).post('/users/signUp').send(validPayload);
        expect(res.status).toBe(200);
        expect(res.body.result).toBe(true);

        const user = await userModel.findOne({ email: validPayload.email });
        expect(user).not.toBeNull();
        expect(user.firstName).toBe('Marie');
        expect(user.lastName).toBe('Martin');
        expect(user.isVerified).toBe(false);
    });

    it('retourne result: false si l\'email existe déjà', async () => {
        await createTestUser({ email: validPayload.email });
        const res = await request(app).post('/users/signUp').send(validPayload);
        expect(res.status).toBe(200);
        expect(res.body.result).toBe(false);
    });

    it('hash le mot de passe (ne stocke pas en clair)', async () => {
        await request(app).post('/users/signUp').send(validPayload);
        const user = await userModel.findOne({ email: validPayload.email });
        expect(user.password).not.toBe(validPayload.password);
        expect(user.password).toMatch(/^\$2b\$/);
    });
});

describe('Auth — Connexion (POST /users/signIn)', () => {
    it('connecte avec des identifiants valides et retourne un token', async () => {
        await createTestUser({ email: 'jean.dupont@test.com' });
        const res = await request(app)
            .post('/users/signIn')
            .send({ email: 'jean.dupont@test.com', password: 'TestPassword123!' });

        expect(res.status).toBe(200);
        expect(res.body.result).toBe(true);
        expect(res.body.userToken).toBeDefined();
        expect(res.body.refreshToken).toBeDefined();
    });

    it('retourne result: false si le mot de passe est incorrect', async () => {
        await createTestUser({ email: 'jean.dupont@test.com' });
        const res = await request(app)
            .post('/users/signIn')
            .send({ email: 'jean.dupont@test.com', password: 'MauvaisMotDePasse!' });

        expect(res.status).toBe(200);
        expect(res.body.result).toBe(false);
        expect(res.body.message).toMatch(/Mot de passe/);
    });

    it('retourne result: false si l\'utilisateur n\'existe pas', async () => {
        const res = await request(app)
            .post('/users/signIn')
            .send({ email: 'inexistant@test.com', password: 'Test123!' });

        expect(res.status).toBe(200);
        expect(res.body.result).toBe(false);
        expect(res.body.message).toMatch(/inexistant/i);
    });
});

describe('Auth — Déconnexion (GET /users/signOut)', () => {
    it('déconnecte et efface le cookie refreshToken', async () => {
        const res = await request(app).get('/users/signOut');
        expect(res.status).toBe(200);
        expect(res.body.message).toMatch(/Déconnexion/);
    });
});

describe('Auth — Vérification email (GET /users/verify-email)', () => {
    it('retourne 404 si le token est absent', async () => {
        const res = await request(app).get('/users/verify-email');
        expect(res.status).toBe(404);
    });

    it('redirige vers signIn?emailVerified=true avec un token valide', async () => {
        await createTestUser({
            email: 'jean.dupont@test.com',
            emailToken: 'mon-token-valide',
            isVerified: false,
        });

        const res = await request(app).get('/users/verify-email?emailToken=mon-token-valide');
        expect(res.status).toBe(302);
        expect(res.headers.location).toContain('/signIn?emailVerified=true');

        const user = await userModel.findOne({ email: 'jean.dupont@test.com' });
        expect(user.isVerified).toBe(true);
        expect(user.emailToken).toBeNull();
    });

    it('redirige vers signIn?confirmedMail=true avec un token invalide', async () => {
        const res = await request(app).get('/users/verify-email?emailToken=token-inexistant');
        expect(res.status).toBe(302);
        expect(res.headers.location).toContain('/signIn?confirmedMail=true');
    });
});

describe('Auth — Profil (POST /users/loadProfil)', () => {
    it('retourne le profil de l\'utilisateur connecté', async () => {
        const user = await createTestUser({ email: 'jean.dupont@test.com' });
        const token = generateAccessToken(user.email);

        const res = await request(app)
            .post('/users/loadProfil')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.result).toBe(true);
        expect(res.body.user.email).toBe('jean.dupont@test.com');
        expect(res.body.user.firstName).toBe('Jean');
        expect(res.body.user.password).toBeUndefined();
    });

    it('retourne 401 si pas de token', async () => {
        const res = await request(app).post('/users/loadProfil');
        expect(res.status).toBe(401);
    });
});

describe('Auth — Mise à jour profil (PUT /users/updateProfile)', () => {
    it('met à jour le profil avec un token valide', async () => {
        const user = await createTestUser({ email: 'jean.dupont@test.com' });
        const token = generateAccessToken(user.email);

        const res = await request(app)
            .put('/users/updateProfile')
            .set('Authorization', `Bearer ${token}`)
            .send({ firstName: 'Pierre', lastName: 'Bernard', phoneNumber: '0698765432' });

        expect(res.status).toBe(200);
        expect(res.body.result).toBe(true);

        const updated = await userModel.findOne({ email: 'jean.dupont@test.com' });
        expect(updated.firstName).toBe('Pierre');
        expect(updated.lastName).toBe('Bernard');
    });

    it('retourne 401 si pas de token', async () => {
        const res = await request(app).put('/users/updateProfile').send({ firstName: 'Test' });
        expect(res.status).toBe(401);
    });
});
