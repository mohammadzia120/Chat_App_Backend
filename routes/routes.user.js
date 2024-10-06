const express = require("express");
const router = express.Router();

const chatService = require("../services/services.user");
const authentication = require("../middlewares/authentication");
const app = express();

router.post("/register", async (req, res) => {
  const result = await chatService.registerUser(req.body);
  res.send(result);
});

router.post("/login", async (req, res) => {
  const result = await chatService.authUser(req.body);
  res.send(result);
});

router.get("/api/users", authentication, async (req, res) => {
  const result = await chatService.allUser(req);
  res.send(result);
});

module.exports = router;
