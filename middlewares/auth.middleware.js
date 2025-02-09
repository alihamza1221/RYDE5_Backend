const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blackListTokenModel = require("../models/blackListToken.model");
const captainModel = require("../models/driver.model");
const adminModel = require("../models/admin.model");
const blacklistUserModel = require("../models/blackListToken.model");

module.exports.authUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isBlacklisted = await blackListTokenModel.findOne({ token: token });
  if (isBlacklisted) {
    return res.status(401).json({ message: "Blocked user" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);

    const isUserBlackListed = await blacklistUserModel.findById(decoded._id);
    if (isUserBlackListed) {
      return res.status(401).json({ message: "Blocked user" });
    }

    if (user.twoFactor == true && user.otp.verified == false) {
      return res.status(401).json({
        message: "Please verify your account first or request for new otp",
      });
    }
    req.user = user;

    return next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports.authDriver = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isBlacklisted = await blackListTokenModel.findOne({ token: token });

  if (isBlacklisted) {
    return res.status(401).json({ message: "Blacklisted token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const isUserBlackListed = await blacklistUserModel.findById(decoded._id);
    if (isUserBlackListed) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const captain = await captainModel.findById(decoded._id);

    if (captain.twoFactor == true && captain.otp.verified == false) {
      return res.status(401).json({
        message: "Please verify your account first or request for new otp",
      });
    }
    req.captain = captain;

    return next();
  } catch (err) {
    console.log(err);

    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports.authAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

  console.log("token", token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isBlacklisted = await blackListTokenModel.findOne({ token: token });

  if (isBlacklisted) {
    return res.status(401).json({ message: "Currently Blocked Admin" });
  }

  try {
    console.log("--------verify----admin---");
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    const admin = await adminModel.findById(decoded._id);

    console.log("--------admin----login----");
    req.admin = admin;

    return next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
