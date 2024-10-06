const express = require("express");
const router = express.Router();

const chatService = require("../services/services.chat");
const authentication = require("../middlewares/authentication");
const app = express();

router.post("/", authentication, async (req, res) => {
  const result = await chatService.accessChat(req);
  res.send(result);
});

router.get("/", authentication, async (req, res) => {
  const result = await chatService.fetchChats(req);
  res.send(result);
});

router.post("/group", authentication, async (req, res) => {
  const result = await chatService.createGroupChat(req);
  res.send(result);
});

router.put("/rename", authentication, async (req, res) => {
  const result = await chatService.renameGroup(req);
  res.send(result);
});

router.put("/groupadd", authentication, async (req, res) => {
  const result = await chatService.addToGroup(req);
  res.send(result);
});

router.put("/groupremove", authentication, async (req, res) => {
  const result = await chatService.removeFromGroup(req);
  res.send(result);
});

module.exports = router;
