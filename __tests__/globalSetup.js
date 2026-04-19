const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async () => {
    const mongod = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongod.getUri();
    process.env.ACCESS_TOKEN_SECRET = 'test-access-secret-key-for-jest-tests';
    process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret-key-for-jest-tests';
    process.env.GMAIL_USER = 'test@gmail.com';
    process.env.GMAIL_PASSWORD = 'testpassword';
    process.env.FRONT_URL = 'http://localhost:5173';
    process.env.BACK_URL = 'http://localhost:5500';
    process.env.STRIPE_SECRET_KEY = 'sk_test_fake_key_for_tests';
    process.env.LOGO_URL = '/logo.png';
    global.__MONGOD__ = mongod;
};
