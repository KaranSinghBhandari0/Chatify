const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, clearChat } = require("../controllers/message");

router.post("/send/:id", sendMessage);
router.post("/:id", getMessages);
router.post("/clearChat/:receiverId", clearChat);

module.exports = router;