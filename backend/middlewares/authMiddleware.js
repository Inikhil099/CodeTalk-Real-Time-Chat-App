const jwt = require("jsonwebtoken");
const { getUser } = require("../services/auth");

async function verifyToken(req, res, next) {
  const token = req.cookies.uid;
  if (!token) {
    return res.status(401).send("Not authenticated");
  }
  const user = getUser(token);
  if (!user) {
    return res.status(401).send("Not authenticated");
  }
  req.user = user;
  next();
}

module.exports = { verifyToken };
