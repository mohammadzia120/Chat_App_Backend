const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userModel = mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trime: true, required: true, unique: true },
    password: { type: String, trim: true, required: true },
    pic: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwKY1GAB4HLMQq_YLyMCJqRie-dWxdAcZuB3mSg_QuV1Wzz0A&s",
    },
    timeStamp: { type: String },
  },
  {
    timeStamps: true,
  }
);

userModel.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
userModel.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userModel);
module.exports = User;
