const Messages = require("../models/messageModel");
const { mkdirSync, renameSync } = require("fs");
async function getMessages(req, res) {
  try {
    const user1 = req.user.id;
    const user2 = req.body.id;

    if (!user1 || !user2) {
      return res.status(400).send("Both user Id's are required");
    }

    const messages = await Messages.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ timestamp: 1 });
    return res.status(200).json({ messages });
  } catch (error) {
    return res.status(500).send("Sorry Internal Server Error !");
  }
}

async function uploadFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).send("File is required");
    }
    const date = Date.now();
    let fileDir = `uploads/files/${date}`;
    let fileName = `${fileDir}/${req.file.originalname}`;
    mkdirSync(fileDir, { recursive: true });
    renameSync(req.file.path, fileName);
    return res.status(200).json({ filepath: fileName });
  } catch (error) {
    return res.status(500).send("Sorry Internal Server Error !");
  }
}

module.exports = { getMessages, uploadFile };
