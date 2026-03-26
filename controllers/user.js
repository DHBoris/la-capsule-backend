require('dotenv').config();
const bcrypt = require('bcrypt');
const cost = 10;
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userModel = require('../models/user');
const addressModel = require('../models/userAddress');
const { sendVerificationMail } = require('../utils/sendVerificationMail');
const { sendResetPasswordMail } = require('../utils/resetPasswordMail');

const accessSecretKey = process.env.ACCESS_TOKEN_SECRET;
const refreshSecretKey = process.env.REFRESH_TOKEN_SECRET;

// Middleware de génération de token
const createToken = async (id) => {
    return jwt.sign({ user: id }, accessSecretKey, { expiresIn: 60 * 60 * 24 });
};

const createAccessToken = async (userTokenInfo) => {
    return jwt.sign({ userTokenInfo }, accessSecretKey, { expiresIn: 60 * 60 * 24 });
};

const createRefreshToken = async (userTokenInfo) => {
    return jwt.sign({ userTokenInfo }, refreshSecretKey, { expiresIn: 60 * 60 * 24 * 7 });
};

module.exports = {
    signIn: async (req, res) => {
        try {
            const { email, password } = req.body;

            // il faut ajouter lean() pour modifier l'objet moongoose // delete objet
            const foundUser = await userModel.findOne({ email: email }).populate('userAddress');

            if (!foundUser) {
                return res.json({ result: false, message: 'Utilisateur inexistant.' });
            }

            if (!bcrypt.compareSync(password, foundUser.password)) {
                return res.json({
                    result: false,
                    message: `Mot de passe n'est pas correct.`
                });
            }

            const userTokenInfo = foundUser.email;
            // console.log(userTokenInfo);

            // génération des tokens
            const userAccessToken = await createAccessToken(userTokenInfo);
            const userRefreshToken = await createRefreshToken(userTokenInfo);

            // console.log(userAccessToken);
            // console.log(userRefreshToken);
            // console.log(userTokenInfo);

            try {
                const tokenUpdate = await userModel.findOneAndUpdate(
                    { email: email },
                    { refreshToken: userRefreshToken },
                    { new: true }
                );
                // console.log(tokenUpdate);

                if (tokenUpdate) {
                    console.log(`l'informations de l'utilisateur a été mises à jour.`);
                } else {
                    console.log('Utilisateur non trouvé');
                }
            } catch (error) {
                console.log(error);
            }

            // Définir un cookie avec l'userRefreshToken
            res.cookie('refreshToken', userRefreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'Strict',
                expires: new Date(Date.now() + 3 * 7 * 24 * 60 * 60 * 1000)
            });

            return res.json({
                result: true,
                userToken: userAccessToken,
                refreshToken: userRefreshToken
            });
        } catch (error) {
            return res.json({ error: error.message });
        }
    },

    signUp: async (req, res) => {
        try {
            const {
                firstName,
                lastName,
                email,
                phoneNumber,
                password,
                day,
                month,
                year,
                politique,
                abonnement,
                detail_address,
                post_code,
                ville
            } = req.body;

            let userExist = await userModel.findOne({ email: email });

            if (userExist) {
                return res.json({
                    result: false
                });
            } else {
                const hash = bcrypt.hashSync(password, cost);

                const newUser = new userModel({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phoneNumber: phoneNumber,
                    password: hash,
                    day: day,
                    month: month,
                    year: year,
                    politique: politique,
                    abonnement: abonnement,
                    emailToken: crypto.randomBytes(64).toString('hex'),
                    refreshToken: null
                });

                const newAddress = new addressModel({
                    detail_address: detail_address,
                    post_code: post_code,
                    ville: ville
                });

                const addressSaved = await newAddress.save();
                newUser.userAddress.push(addressSaved._id);

                const userSaved = await newUser.save();

                sendVerificationMail(newUser);

                if (userSaved) {
                    console.log(newUser);
                    console.log('Utilisateur est bien enregistré');
                    return res.json({ result: true });
                }
            }
        } catch (error) {
            return res.json({ error: error });
        }
    },
    signOut: async (req, res) => {
        try {
            res.clearCookie('refreshToken');
            return res.json({ message: 'Déconnexion réussie, cookie deleted.' });
        } catch (error) {
            return res.status(500).json({ error: 'Erreur lors de la déconnexion' });
        }
    },
    verifyEmail: async (req, res) => {
        try {
            const emailToken = req.query.emailToken;

            if (!emailToken) return res.status(404).json('EmailToken not found...');

            const user = await userModel.findOne({ emailToken });

            if (user) {
                user.emailToken = null;
                user.isVerified = true;

                await user.save();
                const token = await createToken(user._id);
                res.redirect(process.env.FRONT_URL + '/signIn?emailVerified=true');
            } else res.redirect(process.env.FRONT_URL + '/signIn?confirmedMail=true');
        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);
        }
    },
    requestPasswordReset: async (req, res) => {
        try {
            const { email } = req.body;

            const user = await userModel.findOne({ email });

            if (!user) {
                return res.json({ result: false, message: 'Utilisateur non trouvé.' });
            }

            const resetToken = crypto.randomBytes(20).toString('hex');

            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = Date.now() + 3600000;
            await user.save();

            sendResetPasswordMail(user, resetToken);

            return res.json({
                result: true,
                message: 'Un e-mail de réinitialisation de mot de passe a été envoyé.'
            });
        } catch (error) {
            console.error(error);
            return res.json({
                result: false,
                message: "Une erreur s'est produite lors de la demande de réinitialisation de mot de passe."
            });
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { token, password } = req.body;
            console.log(req.body);

            const user = await userModel.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: new Date() }
            });

            if (!user) {
                return res.json({
                    result: false,
                    message: 'Le jeton de réinitialisation est invalide ou a expiré.'
                });
            }

            const hashedPassword = bcrypt.hashSync(password, cost);
            user.password = hashedPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            return res.json({
                result: true,
                message: 'Le mot de passe a été réinitialisé avec succès.'
            });
        } catch (error) {
            console.error(error);
            return res.json({
                result: false,
                message: "Une erreur s'est produite lors de la réinitialisation du mot de passe."
            });
        }
    },
    loadProfil: async (req, res, next) => {
        const userAccessToken = res.locals.userAccessToken;
        const userInfo = res.locals.userInfo;
        // console.log(userAccessToken);
        // console.log(userInfo);

        const foundUser = await userModel.findOne({ email: userInfo }).populate('userAddress');
        // console.log(foundUser);

        const loadedUserData = {
            firstName: foundUser.firstName,
            lastName: foundUser.lastName,
            phoneNumber: foundUser.phoneNumber,
            email: foundUser.email,
            userAddress: foundUser.userAddress
        };

        try {
            return res.json({
                result: true,
                message: 'Protected Resource',
                user: loadedUserData,
                accessToken: userAccessToken
            });
        } catch (error) {
            return res.status(500).send(error.message);
        }
    },

    // test codes ////////////////////////////////

    // checkCookie: async (req, res) => {
    //     // console.log('this is checker');
    //     // console.log(req.cookies.refreshToken);
    //     const token = req.cookies.refreshToken.data;
    //     if (!token) return res.status(401).send(`Pas d'accès.`);

    //     // Déchiffrer le jeton chiffré
    //     const iv = Buffer.from(req.cookies.refreshToken.iv, 'base64');
    //     const encryptedToken = {
    //         iv: iv,
    //         data: token
    //     };

    //     const decipher = crypto.createDecipheriv(algorithm, encryptionKey, iv);
    //     let decryptedToken = decipher.update(encryptedToken.data, 'base64', 'utf8');
    //     decryptedToken += decipher.final('utf8');
    //     // console.log(decryptedToken);
    //     // Vérifier JWT
    //     jwt.verify(decryptedToken, encryptionKey, (err, user) => {
    //         if (err) {
    //             return res.status(403).send('La vérification du Token a échoué.');
    //         }
    //         // console.log(user);
    //         res.json(req.cookies);
    //     });
    // },

    updateProfile: async (req, res) => {
        try {
            const userInfo = res.locals.userInfo; // L'email de l'utilisateur extrait du jeton
            const { firstName, lastName, phoneNumber, address } = req.body; // Données à mettre à jour
    
            // Utiliser l'email pour trouver l'utilisateur et mettre à jour ses informations
            await userModel.findOneAndUpdate(
                { email: userInfo }, // Utiliser l'email extrait du jeton
                {
                    firstName: firstName,
                    lastName: lastName,
                    phoneNumber: phoneNumber,
                    address: address // Mettez à jour d'autres informations ici
                }
            );
    
            return res.json({ result: true, message: 'Profil utilisateur mis à jour avec succès.' });
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil utilisateur :', error);
            return res.status(500).json({ error: 'Erreur lors de la mise à jour du profil utilisateur.' });
        }
    }
};