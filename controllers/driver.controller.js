const captainModel = require("../models/driver.model");
const captainService = require("../services/driver.services");
const blackListTokenModel = require("../models/blackListToken.model");
const { validationResult } = require("express-validator");

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

  // Upload to Cloudinary
  const driverLicenseResult = await cloudinary.uploader.upload(
    req.files.driverLicense[0].path,
    { folder: "driver-docs" }
  );

  const insuranceResult = await cloudinary.uploader.upload(
    req.files.insurance[0].path,
    { folder: "driver-docs" }
  );

  const hashedPassword = await captainModel.hashPassword(password);

  const captain = await captainService.createCaptain({
    fullname,
    email,
    phoneNo,
    password: hashedPassword,
    color: vehicle.color,
    plate: vehicle.plate,
    capacity: vehicle.capacity,
    vehicleType: vehicle.vehicleType,
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
  fs.unlinkSync(req.files.insurance[0].path);

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
