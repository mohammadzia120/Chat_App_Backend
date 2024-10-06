const crypto = require("crypto");
const algo_key = process.env.ECRYPT_ALGO_KEY;
const salt = process.env.ENCRYPT_SALT;
const encryption_algo = process.env.ENCRYPTION_ALGORITHM;

const encyptData = (data, encoding = "utf8") => {
  const cipher = crypto.createCipheriv(
    encryption_algo,
    crypto.scryptSync(algo_key, salt, 32),
    Buffer.alloc(16, 0)
  );
};

module.exports = encyptData;
