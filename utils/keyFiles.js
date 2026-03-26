const crypto = require('crypto');

// 256 bits (32 octets) Clé de cryptage
const encryptionKey = crypto.randomBytes(64).toString('base64');
// vecteur d'initialisation
const initializeIv = crypto.randomBytes(16);

const encrypt = {
  algorithm : 'aes-256-cbc',
  key: encryptionKey,
  iv: initializeIv,
};

module.exports = encrypt;