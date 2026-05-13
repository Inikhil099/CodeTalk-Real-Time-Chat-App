const mongoose = require("mongoose");
const User = require("../models/userModel");
const Message = require("../models/messageModel");

async function SearchContacts(req, res) {
  try {
    const { searchTerm } = req.body;
    if (!searchTerm) {
      return res.status(400).send("Search is required");
    }
    const sanitizedSearch = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regEx = new RegExp(sanitizedSearch, "i");
    const contacts = await User.find({
      $and: [
        { _id: { $ne: req.user.id } },
        { $or: [{ firstName: regEx, lastName: regEx }, { email: regEx }] },
      ],
    });
    return res.status(200).json({ contacts });
  } catch (error) {
    return res.status(500).send("Sorry Internal Server Error !");
  }
}

async function GetContactsForDmList(req, res) {
  try {
    let userId = req.user.id;
    userId = new mongoose.Types.ObjectId(userId);
    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$receiver",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          Image: "$contactInfo.Image",
          color: "$contactInfo.color",
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);
    return res.status(200).json({ contacts });
  } catch (error) {
    return res.status(500).send("Sorry Internal Server Error !");
  }
}

async function GetAllContacts(req, res) {
  try {
    const users = await User.find(
      { _id: { $ne: req.user.id } },
      "firstName lastName _id email"
    );
    const contacts = users.map((user) => ({
      label:user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
      value:user._id
    }))
    return res.status(200).json({ contacts });
  } catch (error) {
    return res.status(500).send("Sorry Internal Server Error !");
  }
}

module.exports = { SearchContacts, GetContactsForDmList, GetAllContacts };
