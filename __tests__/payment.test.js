jest.mock('stripe', () => {
    const mockSession = { id: 'cs_test_session_123' };
    const mockStripe = {
        checkout: {
            sessions: {
                create: jest.fn().mockResolvedValue(mockSession),
            },
        },
    };
    return jest.fn().mockReturnValue(mockStripe);
});

const request = require('supertest');
const app = require('../app');

const validItems = [
    { name: 'Espresso Éthiopien', price: 4.5, quantity: 2 },
    { name: 'Latte Colombien', price: 5.0, quantity: 1 },
];

describe('Paiement Stripe (POST /create-checkout-session)', () => {
    it('crée une session Stripe et retourne un sessionId', async () => {
        const res = await request(app)
            .post('/create-checkout-session')
            .send({ items: validItems, currency: 'eur' });

        expect(res.status).toBe(200);
        expect(res.body.sessionId).toBe('cs_test_session_123');
    });

    it('retourne 400 si items n\'est pas un tableau', async () => {
        const res = await request(app)
            .post('/create-checkout-session')
            .send({ items: 'pas-un-tableau', currency: 'eur' });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/tableau/i);
    });

    it('retourne 400 si items est absent', async () => {
        const res = await request(app)
            .post('/create-checkout-session')
            .send({ currency: 'eur' });

        expect(res.status).toBe(400);
    });

    it('crée correctement les line_items avec price * 100 (conversion centimes)', async () => {
        const Stripe = require('stripe');
        const stripeInstance = Stripe.mock.results[0].value;

        await request(app)
            .post('/create-checkout-session')
            .send({ items: [{ name: 'Test', price: 3.5, quantity: 1 }], currency: 'eur' });

        expect(stripeInstance.checkout.sessions.create).toHaveBeenCalledWith(
            expect.objectContaining({
                line_items: expect.arrayContaining([
                    expect.objectContaining({
                        price_data: expect.objectContaining({ unit_amount: 350 }),
                        quantity: 1,
                    }),
                ]),
                mode: 'payment',
            })
        );
    });
});
