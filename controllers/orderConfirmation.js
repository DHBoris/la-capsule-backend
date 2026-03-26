const { createMailTransporter } = require('../middleware/createMailTransporter');
const { sendOrderConfirmationMail } = require('../utils/orderConfirmationMail');

const sendConfirmation = async (req, res) => {
    try {
        const { email, firstName, items, total, orderId } = req.body;

        if (!email || !items || !Array.isArray(items)) {
            return res.status(400).json({ result: false, message: 'Données manquantes.' });
        }

        const transporter = createMailTransporter();
        await sendOrderConfirmationMail(transporter, { email, firstName, items, total, orderId });

        res.json({ result: true, message: 'Email de confirmation envoyé.' });
    } catch (error) {
        console.error('Erreur envoi confirmation commande:', error);
        res.status(500).json({ result: false, message: 'Erreur lors de l\'envoi de l\'email.' });
    }
};

module.exports = { sendConfirmation };
