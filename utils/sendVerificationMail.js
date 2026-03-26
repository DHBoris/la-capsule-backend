require('dotenv').config();
const { createMailTransporter } = require ("../middleware/createMailTransporter");

const sendVerificationMail = (user) => {
    const transporter = createMailTransporter();
    const frontURL = process.env.FRONT_URL;
    const logoURL = process.env.LOGO_URL;

    const logo = frontURL + logoURL;

    const mailOptions = {
        from: '"La Capsule" <dhaene.62590@hotmail.fr>',
        to: user.email,
        subject: "Verify your email",
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
                    <h1>Bienvenue chez La Capsule ${user.firstName} !</h1>
                    <p>Nous sommes ravis de vous accueillir dans notre communauté de passionnés de café fraîchement torréfié et moulu.</p>
                    <p>Pour commencer cette aventure caféinée, nous avons besoin de vérifier votre adresse e-mail.</p>
                    <a class="button" href='${process.env.BACK_URL}/users/verify-email?emailToken=${user.emailToken}'>Valider mon e-mail</a>
                    <p>Une fois votre e-mail vérifié, vous pourrez parcourir notre catalogue de cafés exceptionnels, passer des commandes en un clic et découvrir nos recommandations de dégustation. De plus, en tant que membre de notre communauté, vous serez le premier à être informé de nos offres spéciales et de nos nouvelles arrivées.</p>
                    <p>Laissez-vous emporter par l'arôme et la saveur de chaque tasse de café que nous vous livrerons, directement chez vous. Nous sommes impatients de partager cette expérience caféinée avec vous.</p>
                    <p>Bienvenue à bord, et que votre tasse de café soit toujours pleine de délices !</p>
                    <p>L'équipe de La Capsule</p>
                </div>
            </body>
        </html>
    `,
    };

        transporter.sendMail(mailOptions, (error, info) => {
            if(error){
                console.log(error);
            }else {
                console.log("Verification sent")
            }
        })
    }

    module.exports = {sendVerificationMail};