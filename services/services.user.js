const dateFns = require("date-fns");
const generateJWTtoken = require("../jwt/generateJWTtoken");
const User = require("../models/model.user");
const registerUser = async (body) => {
  try {
    const { name, email, password, pic } = body;
    if (!name || !email || !password) {
      return { message: "please enter all the fields", status: 400 };
    }
    const userExists = await User.find({ email });
    if (userExists.length !== 0) {
      return { message: "User already exists", status: 200 };
    }
    const user = await User.create({
      name,
      email,
      password,
      pic,
      timeStamp: dateFns.format(new Date(), "dd-MM-yyyy HH:mm:ss"),
    });
    if (user) {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateJWTtoken(user._id),
      };
    } else {
      return { message: "Failed to create the user", status: 400 };
    }
  } catch (error) {
    return { error: error.message, status: 0 };
  }
};

const authUser = async (body) => {
  try {
    const { email, password } = body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      return {
        result: {
          _id: user._id,
          email: user.email,
          name: user.name,
          token: generateJWTtoken(user._id),
        },
        status: 200,
      };
    } else {
      return {
        result: {
          message: "user is not valid",
        },
        status: 400,
      };
    }
  } catch (error) {
    return { error: error.message, status: 0 };
  }
};

const allUser = async (req) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const results = await User.find(keyword).find({
    _id: { $ne: req.user.id },
  });
  return results;
};
module.exports = { registerUser, authUser, allUser };
