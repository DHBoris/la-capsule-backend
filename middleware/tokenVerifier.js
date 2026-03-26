require('dotenv').config();
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

// 64 octets Clé de cryptage
const accessSecretKey = process.env.ACCESS_TOKEN_SECRET;
const refreshSecretKey = process.env.REFRESH_TOKEN_SECRET;
// Middleware de génération de token
const createAccessToken = async (userTokenInfo) => {
    return jwt.sign({ userTokenInfo }, accessSecretKey, { expiresIn: 60 * 60 * 24 });
};

const createRefreshToken = async (userTokenInfo) => {
    return jwt.sign({ userTokenInfo }, refreshSecretKey, { expiresIn: 60 * 60 * 24 * 7 });
};


module.exports = {
    tokenVerifier: async (req, res, next) => {
        // console.log(req.cookies);
        // console.log(req.body);
        // console.log(req.headers);

        const authorizationHeader = req.headers['authorization'];
        // console.log(authorizationHeader);

        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            console.log('Non autorisé');
        }
        if (!req.body) console.log(`Pas d'accès.`);

        const accessToken = authorizationHeader.split(' ')[1];
        const refreshToken = req.cookies['refreshToken'];

        if (!accessToken && !refreshToken) {
            return res.status(401).send('Access Denied. No token provided.');
        }

        // Vérification du jeton d'accès
        try {
            const accessTokenDecoded = jwt.verify(accessToken, accessSecretKey);
            res.locals.userAccessToken = accessToken;
            res.locals.userInfo = accessTokenDecoded.userTokenInfo;
            next();
        } catch (error) {
            if (!refreshToken) {
                return res
                    .status(401)
                    .send(`Les jetons sont expires, Vous n'avez pas la permission. Vous serez déconnecté`);
            }

            try {
                const refreshTokenDecoded = jwt.verify(refreshToken, refreshSecretKey);
                // console.log(refreshTokenDecoded);
                const newAccessToken = await createAccessToken(refreshTokenDecoded.userTokenInfo);
                const newRefreshToken = await createRefreshToken(refreshTokenDecoded.userTokenInfo);

                res.locals.userAccessToken = newAccessToken;
                res.locals.userInfo = refreshTokenDecoded.userTokenInfo;

                const tokenUpdate = await userModel.findOneAndUpdate(
                    { email: refreshTokenDecoded.userTokenInfo },
                    { refreshToken: newRefreshToken },
                    { new: true }
                );

                if (tokenUpdate) {
                    console.log(`l'informations de l'utilisateur a été mises à jour.`);
                    res.cookie('refreshToken', newRefreshToken, {
                        httpOnly: true,
                        secure: false,
                        sameSite: 'Strict',
                        expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1 * 1000)
                    });

                    next();
                } else {
                    return res.status(400).send('Utilisateur non trouvé');
                }
            } catch (error) {
                console.log(error);
                return res.status(400).send('Invalid Token.');
            }
            //         const accessTokenExpTime = accessToken.exp;
            //         const accessTokenisValid = expirationTimeChecker(accessTokenExpTime);
        }
    }
};
