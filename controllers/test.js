const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// algorithm de cryptage
const algorithm = 'aes-256-cbc';
// 256 bits (32 octets) Clé de cryptage
const encryptionKey = crypto.randomBytes(32);
// vecteur d'initialisation
const initializeIv = crypto.randomBytes(16);

const user = {
    _id: '653f87a141bed9fb6c5ef780',
    firstName: 'CHO',
    lastName: 'HyeonGeun',
    email: 'hyeongeun.cho.2022@gmail.com',
    day: null,
    month: null,
    year: null,
    politique: false,
    abonnement: false,
    userAddress: [
        {
            _id: '653f87a141bed9fb6c5ef781',
            detail_address: '144 rue Jean jaurès',
            ville: 'lille',
            post_code: 59160,
            __v: 0,
        },
    ],
    isVerified: true,
    emailToken: null,
    __v: 0,
};

// Middleware de génération de token
const createAccessToken = async (userTokenInfo) => {
    const token = jwt.sign(userTokenInfo, encryptionKey, { expiresIn: '1d' });
    console.log(token);
    const cipher = crypto.createCipheriv(algorithm, encryptionKey, initializeIv);
    let encryptedToken = cipher.update(token, 'utf8', 'base64');
    encryptedToken += cipher.final('base64');

    return {
        iv: initializeIv.toString('base64'),
        data: encryptedToken,
    };
};

module.exports = {
    test: async (req, res, next) => {
        const userInfo = await createAccessToken(user);
        console.log(userInfo);

        const accessIvValue = Buffer.from(userInfo.iv, 'base64');
        const accessTokenData = userInfo.data;
        
        console.log(accessIvValue);
        console.log(accessTokenData);

        const decipher = crypto.createDecipheriv(algorithm, encryptionKey, accessIvValue);

        let decryptedToken = decipher.update(accessTokenData, 'base64', 'utf8');
        decryptedToken += decipher.final('utf8');

        console.log(decryptedToken);

        jwt.verify(decryptedToken, encryptionKey, (accessTokenError, accessToken) => {
            if (accessTokenError) {
                return res.status(401).json({ message: `Jeton d'accès non valide.` });
            }
            console.log(accessToken);
        });
    },
};
