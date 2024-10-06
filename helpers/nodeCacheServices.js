const NodeCache = require("node-cache");
const chatAppCache = new NodeCache({ stdTTL: 0, checkperiod: 0 });

//get the value of a variable key from mem-cache
const getValueFromCache = (key) => {
  console.log(key);
  return chatAppCache.get(key);
};

//   set value of a variable to mem-chache with expiry time
const setValueToCahce = async (key, data, expiresIn) => {
  chatAppCache.set(key, data, expiresIn);
};

//  check if mem-cache has a key present in it
const checkIfValuePresentInCache = async (key) => {
  return chatAppCache.has(key);
};

module.exports = {
  getValueFromCache,
  setValueToCahce,
  checkIfValuePresentInCache,
};
