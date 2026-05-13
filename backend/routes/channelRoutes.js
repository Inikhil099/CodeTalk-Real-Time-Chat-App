const express = require("express");
const {
  createChannel,
  getUserChannels,
  getChannelMessages,
} = require("../controllers/channelController");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/create-channel", verifyToken, createChannel);
router.get("/get-user-channels", verifyToken, getUserChannels);
router.get("/get-channel-messages/:channelId", verifyToken, getChannelMessages);

module.exports = router;
