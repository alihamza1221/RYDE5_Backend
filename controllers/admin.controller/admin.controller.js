const adminModel = require("../../models/admin.model");
const { validationResult } = require("express-validator");
// const blackListTokenModel = require("../models/blackListToken.model");
const adminServices = require("../../services/admin.services");

module.exports.registerAdmin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { password } = req.body;

  const hashedPassword = await adminModel.hashPassword(password);

  const admin = await adminServices.createAdmin({
    password: hashedPassword,
  });

  const token = admin.generateAuthToken();

  res.status(201).json({ token, admin });
};

module.exports.loginAdmin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { password } = req.body;

    const admins = await adminModel.find().select("+password");

    if (admins.length === 0) {
      return res.status(401).json({ message: "Invalid Command" });
    }

    const admin = admins.find(async (admin) => {
      const isMatch = await admin.comparePassword(password);
      if (isMatch) {
        return admin;
      }
    });

    if (!admin) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = admin.generateAuthToken();

    res.cookie("token", token);

    res.status(200).json({ token, admin });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports.getAdminProfile = async (req, res, next) => {
  res.status(200).json(req.user);
};

module.exports.logoutAdmin = async (req, res, next) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];
  //   await blackListTokenModel.create({ token });

  res.status(200).json({ message: "Logged out" });
};
