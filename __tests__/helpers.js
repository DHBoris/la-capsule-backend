const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const addressModel = require('../models/userAddress');

const createTestUser = async (overrides = {}) => {
    const hash = bcrypt.hashSync('TestPassword123!', 10);

    const address = new addressModel({
        detail_address: '10 rue de la Paix',
        post_code: 75001,
        ville: 'Paris',
    });
    const savedAddress = await address.save();

    const user = new userModel({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@test.com',
        phoneNumber: '0612345678',
        password: hash,
        day: 1,
        month: 6,
        year: 1990,
        politique: true,
        abonnement: false,
        emailToken: 'valid-email-token-123',
        isVerified: true,
        refreshToken: null,
        userAddress: [savedAddress._id],
        ...overrides,
    });
    await user.save();
    return user;
};

const generateAccessToken = (email = 'jean.dupont@test.com') => {
    return jwt.sign(
        { userTokenInfo: email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
    );
};

const generateRefreshToken = (email = 'jean.dupont@test.com') => {
    return jwt.sign(
        { userTokenInfo: email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
};

const generateExpiredToken = (email = 'jean.dupont@test.com') => {
    return jwt.sign(
        { userTokenInfo: email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: -1 }
    );
};

module.exports = { createTestUser, generateAccessToken, generateRefreshToken, generateExpiredToken };
