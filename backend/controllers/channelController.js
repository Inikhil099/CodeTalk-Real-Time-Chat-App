const mongoose = require("mongoose");
const CHANNEL = require("../models/channelModel");
const User = require("../models/userModel");

async function createChannel(req, res) {
  try {
    const { name, members } = req.body;
    const userId = req.user.id;
    const admin = await User.findById(userId);
    if (!admin) {
      return res.status(400).send("Admin User Not Found");
    }

    const validateMembers = await User.find({ _id: { $in: members } });
    if (validateMembers.length != members.length) {
      return res.status(400).send("Some members are not valid users");
    }

    const newChannel = new CHANNEL({
      name,
      members,
      admin: userId,
    });
    await newChannel.save();
    return res.status(201).json({ channel: newChannel });
  } catch (error) {
    console.log(error);
    return res.statue(500).send("Sorry Internal Sever Error");
  }
}

async function getUserChannels(req, res) {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const channels = await CHANNEL.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updatedAt: -1 });

    return res.status(201).json({ channels });
  } catch (error) {
    console.log(error);
    return res.statue(500).send("Sorry Internal Sever Error");
  }
}

async function getChannelMessages(req, res) {
  try {
    const { channelId } = req.params;
    const channel = await CHANNEL.findById(channelId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "firstName lastName email _id Image color",
      },
    });

    if (!channel) {
      return res.status(404).send("Channel Not Found");
    }

    return res.status(201).json({ allChannelMessages: channel.messages });
  } catch (error) {
    console.log(error);
    return res.statue(500).send("Sorry Internal Sever Error");
  }
}

module.exports = { createChannel, getUserChannels, getChannelMessages };
