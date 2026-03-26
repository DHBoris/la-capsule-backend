const sendOrderConfirmationMail = (transporter, { email, firstName, items, total, orderId }) => {
    const itemsRows = items.map(item => `
        <tr>
            <td style="padding: 12px 16px; border-bottom: 1px solid #f0ede8; font-family: Arial, sans-serif; font-size: 15px; color: #270722;">
                ${item.name || 'Café'}
            </td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #f0ede8; text-align: center; font-family: Arial, sans-serif; font-size: 15px; color: #270722;">
                ${item.quantity}
            </td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #f0ede8; text-align: right; font-family: Arial, sans-serif; font-size: 15px; color: #270722;">
                ${(item.price * item.quantity).toFixed(2)} €
            </td>
        </tr>
    `).join('');

    const mailOptions = {
        from: '"La Capsule" <dhaene.62590@hotmail.fr>',
        to: email,
        subject: '☕ Votre commande La Capsule est confirmée !',
        html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"></head>
        <body style="margin:0; padding:0; background-color:#f5f0eb; font-family: Arial, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f0eb; padding: 40px 0;">
                <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">

                            <!-- HEADER -->
                            <tr>
                                <td style="background-color: #270722; padding: 32px 40px; text-align: center;">
                                    <img src="https://res.cloudinary.com/rupo/image/upload/v1697115700/logo_fl8ltf.png" alt="La Capsule" style="height: 50px;">
                                </td>
                            </tr>

                            <!-- HERO -->
                            <tr>
                                <td style="padding: 40px 40px 24px; text-align: center; border-bottom: 1px solid #f0ede8;">
                                    <div style="font-size: 48px; margin-bottom: 16px;">✅</div>
                                    <h1 style="margin: 0 0 8px; font-size: 26px; color: #270722; font-weight: bold;">Commande confirmée !</h1>
                                    <p style="margin: 0; font-size: 16px; color: #88665d; line-height: 1.6;">
                                        Merci ${firstName || ''} pour votre commande.<br>
                                        Nous préparons votre café avec soin.
                                    </p>
                                    ${orderId ? `<p style="margin: 16px 0 0; font-size: 13px; color: #aaa;">Référence : <code style="background:#f5f0eb; padding: 2px 8px; border-radius: 4px;">${orderId.slice(0, 24)}...</code></p>` : ''}
                                </td>
                            </tr>

                            <!-- ORDER SUMMARY -->
                            <tr>
                                <td style="padding: 32px 40px;">
                                    <h2 style="margin: 0 0 20px; font-size: 18px; color: #270722; font-weight: bold;">Récapitulatif de votre commande</h2>
                                    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                                        <thead>
                                            <tr style="background-color: #f5f0eb;">
                                                <th style="padding: 12px 16px; text-align: left; font-size: 13px; color: #88665d; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Produit</th>
                                                <th style="padding: 12px 16px; text-align: center; font-size: 13px; color: #88665d; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Qté</th>
                                                <th style="padding: 12px 16px; text-align: right; font-size: 13px; color: #88665d; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Prix</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${itemsRows}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colspan="2" style="padding: 16px; text-align: right; font-size: 14px; color: #88665d;">Livraison</td>
                                                <td style="padding: 16px; text-align: right; font-size: 14px; color: #1f3a30; font-weight: bold;">Gratuite</td>
                                            </tr>
                                            <tr style="background-color: #270722;">
                                                <td colspan="2" style="padding: 16px; text-align: right; font-size: 16px; color: #fffcf6; font-weight: bold;">Total</td>
                                                <td style="padding: 16px; text-align: right; font-size: 18px; color: #c69e89; font-weight: bold;">${total} €</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </td>
                            </tr>

                            <!-- FOOTER -->
                            <tr>
                                <td style="padding: 32px 40px; background-color: #f5f0eb; text-align: center; border-top: 1px solid #ede8e0;">
                                    <p style="margin: 0 0 8px; font-size: 14px; color: #88665d;">Des questions ? Contactez-nous</p>
                                    <p style="margin: 0; font-size: 13px; color: #aaa;">© La Capsule — Votre café, votre création</p>
                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Email error:', error);
                reject(error);
            } else {
                console.log('Order confirmation email sent');
                resolve(info);
            }
        });
    });
};

module.exports = { sendOrderConfirmationMail };
