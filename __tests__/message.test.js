const request = require('supertest');
const app = require('../app');
const messageModel = require('../models/message');

describe('Formulaire de contact (POST /message)', () => {
    const validPayload = {
        firstName: 'Sophie',
        lastName: 'Leclerc',
        email: 'sophie.leclerc@test.com',
        callNumber: 612345678,
        message: 'Bonjour, je voudrais des informations sur vos cafés.',
        politique: true,
    };

    it('enregistre un message de contact et retourne result: true', async () => {
        const res = await request(app).post('/message').send(validPayload);

        expect(res.status).toBe(200);
        expect(res.body.result).toBe(true);

        const saved = await messageModel.findOne({ email: validPayload.email });
        expect(saved).not.toBeNull();
        expect(saved.firstName).toBe('Sophie');
        expect(saved.lastName).toBe('Leclerc');
        expect(saved.message).toBe(validPayload.message);
    });

    it('enregistre plusieurs messages différents', async () => {
        await request(app).post('/message').send(validPayload);
        await request(app).post('/message').send({ ...validPayload, email: 'autre@test.com' });

        const count = await messageModel.countDocuments();
        expect(count).toBe(2);
    });
});
