const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`mongodb connected to ${conn.connection.host}`.yellow.bold);
  } catch (e) {
    console.log(`Error: ${e.message}`.red.bold);
  }
};
module.exports = connectDB;
