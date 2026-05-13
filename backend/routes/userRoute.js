const express = require("express");
const { UserSignup, UserLogin, getUserInfo, UpdateProfile, AddProfileImage, RemoveProfileImage, LogoutUser } = require("../controllers/userController");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();
const multer = require("multer")

const upload = multer({dest: "uploads/profiles/"}) 

router.post("/signup",UserSignup)
router.post("/login",UserLogin)
router.get("/userinfo",verifyToken,getUserInfo)
router.post("/update-profile",verifyToken,UpdateProfile)  
router.post("/add-profile-image",verifyToken,upload.single("profile-image"),AddProfileImage)
router.delete("/remove-profile-image",verifyToken,RemoveProfileImage)
router.post("/logout",LogoutUser)




module.exports = router;