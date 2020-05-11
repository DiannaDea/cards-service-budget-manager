const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const KEYS_PATH = path.resolve(__dirname, '../keys');
const PRIVATE_KEY = fs.readFileSync(`${KEYS_PATH}/private.key`, 'utf8');
const PUBLIC_KEY = fs.readFileSync(`${KEYS_PATH}/public.key`, 'utf8');

function encrypt(text) {
  const buffer = Buffer.from(text, 'utf8');
  const encrypted = crypto.publicEncrypt(PUBLIC_KEY, buffer);
  return encrypted.toString('base64');
}

function decrypt(text) {
  try {
    const buffer = Buffer.from(text, 'base64');
    const decrypted = crypto.privateDecrypt(
      {
        key: PRIVATE_KEY.toString(),
        passphrase: '',
      },
      buffer,
    );
    return decrypted.toString('utf8');
  } catch (error) {
    return null;
  }
}

module.exports = {
  encrypt,
  decrypt,
};
