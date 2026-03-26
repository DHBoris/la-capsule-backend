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

    const lineItems = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal'], // Include PayPal as a payment method
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONT_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONT_URL}/cart`,
    });

    res.json({ sessionId: session.id }); // Retourne uniquement l'identifiant de session
  } catch (error) {
    console.error('Erreur lors de la création de la session de paiement :', error);
    res.status(500).send({ error: 'Erreur lors de la création de la session de paiement.' });
  }
};

module.exports = {
  createCheckoutSession,
};
