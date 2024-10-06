// const jwt = require("jsonwebtoken");
// const { checkIfAuthTokenExpired } = require("../helpers/utilities");
// const User = require("../models/model.user");

// const authentication = async (req, res, next) => {
//   console.log(req);
//   const result = checkIfAuthTokenExpired();
//   console.log("result ", result);
//   next();
// };
// module.exports = authentication;

const jwt = require("jsonwebtoken");
const fs = require("fs");
const User = require("../models/model.user");
const PRIV_KEY = fs.readFileSync(
  `D:\\chat_app\\Backend\\jwt\\id_rsa_public.pem`,
  "utf8"
);
const authentication = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, PRIV_KEY);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      throw new Error("Not authorized, token is not valid");
    }
  }
  if (!token) {
    throw new Error("Not authorized, no token found");
  }
};

module.exports = authentication;
