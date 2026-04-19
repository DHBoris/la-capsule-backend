const Stripe = require('stripe');
require('dotenv').config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-08-16',
});

const createCheckoutSession = async (req, res) => {
  try {
    const { items, currency } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).send({ error: 'Le champ "items" doit être un tableau.' });
    }

    console.log('Items reçus pour Stripe:', JSON.stringify(items));

    const lineItems = items.map((item) => {
      const unitAmount = Math.round(parseFloat(item.price) * 100);
      if (isNaN(unitAmount) || unitAmount <= 0) {
        throw new Error(`Prix invalide pour "${item.name}": reçu "${item.price}"`);
      }
      return {
        price_data: {
          currency: currency,
          product_data: { name: item.name || 'Article' },
          unit_amount: unitAmount,
        },
        quantity: item.quantity || 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONT_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONT_URL}/cart`,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Erreur lors de la création de la session de paiement :', error);
    res.status(500).send({ error: 'Erreur lors de la création de la session de paiement.' });
  }
};

module.exports = {
  createCheckoutSession,
};
