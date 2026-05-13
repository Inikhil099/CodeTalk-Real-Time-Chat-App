const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { setUser } = require("../services/auth");
const maxAge = 3 * 24 * 60 * 60 * 1000;

const { renameSync, unlinkSync } = require("fs");

async function UserSignup(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Both Email and Password are required");
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).send("User already exist");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({ email, password: hashedPassword });

    const token = setUser(newUser);
    // res.cookie("uid", token, { httpOnly: true, sameSite: "strict", maxAge });

    return res.status(201).json({
      user: { id: newUser._id, email: newUser.email },
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Sorry Internal Server Error !");
  }
}

async function UserLogin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("both email and password are required");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("User not found");
    }

    const veryfying = await bcrypt.compare(password, user.password);
    if (!veryfying) {
      return res.status(400).send("Incorrect password");
    }
    const token = setUser(user);
    // res.cookie("uid", token, { httpOnly: true, sameSite: "strict", maxAge });

    return res.status(200).json({ userdata: user,token });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Sorry Internal Server Error !");
  }
}

// <-----------------------------Logout--------------------------------------->

async function LogoutUser(req, res) {
  try {
    res.clearCookie("uid");
    return res.status(200).send("Logged Out Successfully");
  } catch (error) {
    return res.status(500).send("Sorry Internal Server Error !");
  }
}

// <-----------------Getting User Data for Login if cookie is set ------------------------>

async function getUserInfo(req, res) {
  try {
    const userdata = await User.findOne({ _id: req.user.id });
    if (!userdata) return res.send("user not found signup first ");
    return res.status(200).json({
      id: userdata.id,
      email: userdata.email,
      profileSetup: userdata.profileSetup,
      firstName: userdata.firstName,
      lastName: userdata.lastName,
      color: userdata.color,
      image: userdata.Image,
    });
  } catch (error) {
    return res.status(500).send("Sorry Internal Server Error !");
  }
}

// <----------------------Updating Profile ------------------------------>

async function UpdateProfile(req, res) {
  const { firstName, lastName, color } = req.body;
  if (!firstName || !lastName) {
    return res.status(400).send("All the infos are required");
  }
  try {
    const userdata = await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true },
    );
    return res.status(200).json({ userdata: userdata });
  } catch (error) {
    return res.status(500).send("Sorry Internal Server Error !");
  }
}

// <----------------------Adding Profile Image ------------------------------>

async function AddProfileImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).send("File is required to Update Profile Image");
    }

    const date = Date.now();
    let fileName = "uploads/profiles/" + date + req.file.originalname;
    renameSync(req.file.path, fileName);

    const user = await User.findOneAndUpdate(
      { _id: req.user.id },
      { Image: fileName },
      { new: true, runValidators: true },
    );
    return res.status(200).json({
      image: user.Image,
    });
  } catch (error) {
    return res.status(500).send("Sorry Internal Server Error !");
  }
}

// <----------------------Removing Profile Image ------------------------------>

async function RemoveProfileImage(req, res) {
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(400).send("User Not Found");
    }

    if (user.Image) {
      unlinkSync(user.Image);
    }

    user.Image = null;
    await user.save();

    return res.status(200).send("Profile Image Removed Successfully");
  } catch (error) {
    return res.status(500).send("Sorry Internal Server Error !");
  }
}

module.exports = {
  UserSignup,
  UserLogin,
  getUserInfo,
  UpdateProfile,
  AddProfileImage,
  RemoveProfileImage,
  LogoutUser,
};
