const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const colors = require("colors");
const connectDB = require("./config/db");
const generateJWTtoken = require("./jwt/generateJWTtoken");
const authentication = require("./middlewares/authentication");

dotenv.config();

connectDB();
app.use(cors());
app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;

app.use("/", require("./routes/routes.user"));
app.use("/api/chat", require("./routes/routes.chat"));

app.listen(5000, console.log(`Server started on PORT ${PORT}`.yellow.bold));
