// run node jwt/generateKeyPair.js command to get the keys
const crypto = require("crypto");
const fs = require("fs");
function genKeyPair() {
  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });
  fs.writeFileSync(`${__dirname}/id_rsa_public.pem`, keyPair.publicKey);
  fs.writeFileSync(`${__dirname}/id_rsa_private.pem`, keyPair.privateKey);
}

genKeyPair();
