const captainModel = require("../models/driver.model");
const captainService = require("../services/driver.services");
const blackListTokenModel = require("../models/blackListToken.model");
const { validationResult } = require("express-validator");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");

module.exports.registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    fullname,
    email,
    phoneNo,
    password,
    vehicle,
    driverLicenseExpiryDate,
    carInsuranceExpiryDate,
  } = req.body;

  const isCaptainAlreadyExist = await captainModel.findOne({ email });

  if (isCaptainAlreadyExist) {
    return res.status(400).json({ message: "Captain already exist" });
  }

  if (!req.files || !req.files.driverLicense || !req.files.carInsurance) {
    return res.status(400).json({ message: "All documents are required" });
  }

  // Validate vehicle object
  const vehicleObj =
    typeof vehicle === "string" ? JSON.parse(vehicle) : vehicle;

  const sendErrorStatus = (message) => {
    res.status(400).json({ message });
  };

  if (!vehicleObj.color || vehicleObj.color.length < 3)
    sendErrorStatus("Color must be at least 3 characters");
  if (!vehicleObj.plate) sendErrorStatus("Plate is required");
  if (!vehicleObj.capacity || vehicleObj.capacity < 1)
    sendErrorStatus("Capacity must be at least 1");
  if (!["car", "motorcycle", "auto"].includes(vehicleObj.vehicleType))
    sendErrorStatus("Invalid vehicle type");
  if (!vehicleObj.vehicleModel) sendErrorStatus("Vehicle model is required");

  // Upload to Cloudinary

  const driverLicenseResult = await cloudinary.uploader.upload(
    req.files.driverLicense[0].path,
    { folder: "driver-docs", resource_type: "raw", timeout: 120000 }
  );

  const insuranceResult = await cloudinary.uploader.upload(
    req.files.carInsurance[0].path,
    { folder: "driver-docs", resource_type: "raw", timeout: 120000 }
  );

  const hashedPassword = await captainModel.hashPassword(password);

  const captain = await captainService.createCaptain({
    fullname,
    email,
    phoneNo,
    password: hashedPassword,
    color: vehicleObj.color,
    plate: vehicleObj.plate,
    capacity: vehicleObj.capacity,
    vehicleType: vehicleObj.vehicleType,
    vehicleModel: vehicleObj.vehicleModel,
    driverLicense: {
      url: driverLicenseResult.secure_url,
      uploadDate: new Date(),
      expiryDate: driverLicenseExpiryDate,
    },
    carInsurance: {
      url: insuranceResult.secure_url,
      uploadDate: new Date(),
      expiryDate: carInsuranceExpiryDate,
    },
  });
  // Clean up uploaded files
  fs.unlinkSync(req.files.driverLicense[0].path);
  fs.unlinkSync(req.files.carInsurance[0].path);

  const token = captain.generateAuthToken();

  res.status(201).json({ token, captain });
};

module.exports.loginCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const captain = await captainModel.findOne({ email }).select("+password");

  if (!captain) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await captain.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = captain.generateAuthToken();

  res.cookie("token", token);

  res.status(200).json({ token, captain });
};

module.exports.getCaptainProfile = async (req, res, next) => {
  res.status(200).json({ captain: req.captain });
};

module.exports.logoutCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  //   await blackListTokenModel.create({ token });

  res.clearCookie("token");

  res.status(200).json({ message: "Logout successfully" });
};
