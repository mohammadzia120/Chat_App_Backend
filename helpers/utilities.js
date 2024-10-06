const { generateJWTtoken } = require("../jwt/generateJWTtoken");
const {
  checkIfValuePresentInCache,
  setValueToCahce,
  getValueFromCache,
} = require("./nodeCacheServices");

const checkIfAuthTokenExpired = async (id) => {
  if (await checkIfValuePresentInCache("authTokenResponse")) {
    return getValueFromCache("authTokenResponse");
  }
  const sessionTokenResponse = await generateJWTtoken(id);
  await setValueToCahce(
    "authTokenResponse",
    sessionTokenResponse.data,
    sessionTokenResponse.data.expiresIn
  );
  return sessionTokenResponse.data;
};

module.exports = { checkIfAuthTokenExpired };
