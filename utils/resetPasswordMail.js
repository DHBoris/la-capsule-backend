require('dotenv').config();
const { createMailTransporter } = require("../middleware/createMailTransporter");

const sendResetPasswordMail = (user, resetToken) => {
    const transporter = createMailTransporter();
    const frontURL = process.env.FRONT_URL;

  

    const mailOptions = {
        from: '"La Capsule" <dhaene.62590@hotmail.fr>',
        to: user.email,
        subject: "Réinitialisation de mot de passe",
        html: `
        <html>
            <head>
            <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f0f0f0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                text-align: center; /* Centrer tout le contenu */
            }
            h1 {
                color: #8B4513;
            }
            p {
                font-size: 16px;
                line-height: 1.5;
                color: #333;
            }
            .button {
                display: inline-block;
                margin-top: 20px;
                padding: 10px 20px;
                background-color: #8B4513;
                color: #fff !important;
                text-decoration: none;
                border-radius: 4px;
                display: block; /* Pour que le bouton prenne toute la largeur */
                width: 200px; /* Largeur fixe du bouton */
                margin: 20px auto; /* Centre le bouton horizontalement */
            }
        </style>
            </head>
            <body>
            <div class="container">
                <img class="logo" src="https://res.cloudinary.com/rupo/image/upload/v1697115700/logo_fl8ltf.png" alt="Logo La Capsule">
                <p>Bonjour ${user.firstName},
                Il y a eu une demande de changement de mot de passe !
                
                Si vous n'avez pas fait cette demande, veuillez ignorer cet e-mail.
                
                Sinon, veuillez cliquer sur ce lien pour changer votre mot de passe : </p>
                <a class="button" href='${process.env.FRONT_URL}/new-password?resetToken=${resetToken}'>Réinitialiser le mot de passe</a>
                <p>Cordialement,</p>
                <p>L'équipe La Capsule</p>
            </div>
                
            </body>
        </html>
    `,
    
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            console.log(error);
        }else {
            console.log("Reset password email sent")
        }
    });
};

module.exports = { sendResetPasswordMail };