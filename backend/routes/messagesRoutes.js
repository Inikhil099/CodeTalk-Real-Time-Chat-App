const express = require("express")
const { getMessages, uploadFile } = require("../controllers/messageController")
const { verifyToken } = require("../middlewares/authMiddleware")
const router = express.Router()

const upload = require("multer")({dest:"uploads/files"})
router.post("/get-messages",verifyToken,getMessages)
router.post("/upload-file",verifyToken,upload.single("file"),uploadFile)

module.exports = router;