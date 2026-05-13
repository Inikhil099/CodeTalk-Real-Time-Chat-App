const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
  },
  Image: {
    type: String,
  },
  color: {
    type: Number,
  },
  profileSetup: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("users", userSchema);
module.exports = User; 
