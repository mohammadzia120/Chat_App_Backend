const jwt = require("jsonwebtoken");
const fs = require("fs");
const PRIV_KEY = fs.readFileSync(`${__dirname}/id_rsa_private.pem`, "utf8");
const generateJWTtoken = (id) => {
  const expiresIn = "1d";
  const signedToken = jwt.sign({ id }, PRIV_KEY, {
    expiresIn: "3d",
    algorithm: "RS256",
  });
  return {
    token: `Bearer ${signedToken}`,
    expires: expiresIn,
  };
};

module.exports = generateJWTtoken;
