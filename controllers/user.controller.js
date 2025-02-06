const userModel = require("../models/user.model");
const userService = require("../services/user.services");
const { validationResult } = require("express-validator");
// const blackListTokenModel = require("../models/blackListToken.model");
const otpController = require("../controllers/otp.controller");
const { randomString } = require("../utils/randomString");
module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, phoneNo, password } = req.body;

  const isUserAlready = await userModel.findOne({ email });

  if (isUserAlready) {
    return res.status(400).json({ message: "User already exist" });
  }

  const hashedPassword = await userModel.hashPassword(password);

  const user = await userService.createUser({
    fullname,
    email,
    phoneNo,
    password: hashedPassword,
  });

  const otp = randomString();
  const to = email;
  otpController.sendOtp(to, otp);

  //save otp to db
  user.otp.code = otp;
  await user.save();

  res.status(201).json({ user, otp });
};

module.exports.verifyUser = async (req, res, next) => {
  const { email, otp } = req.body;

  const user = await userModel
    .findOne({
      email,
    })
    .select("+otp.code");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.otp.code !== parseInt(otp)) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  //update user otp to verified
  user.otp.verified = true;
  await user.save();

  const token = user.generateAuthToken();
  return res.status(200).json({ token, user });
};

module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = user.generateAuthToken();

  res.cookie("token", token);

  res.status(200).json({ token, user });
};

module.exports.getUserProfile = async (req, res, next) => {
  res.status(200).json(req.user);
};

module.exports.logoutUser = async (req, res, next) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];

  //   await blackListTokenModel.create({ token });

  res.status(200).json({ message: "Logged out" });
};
