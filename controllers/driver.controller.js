const driverModel = require("../models/driver.model");
const driverServices = require("../services/driver.services");
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

  const isCaptainAlreadyExist = await driverModel.findOne({ email });

  if (isCaptainAlreadyExist) {
    return res.status(400).json({ message: "Captain already exist" });
  }

  console.log("req.body", req.body);
  console.log("files", req.files);
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

  // const driverLicenseResult = await cloudinary.uploader.upload(
  //   `data:${
  //     req.files.driverLicense[0].mimetype
  //   };base64,${req.files.driverLicense[0].buffer.toString("base64")}`,
  //   { folder: "driver-docs", resource_type: "raw", timeout: 120000 }
  // );

  // const insuranceResult = await await cloudinary.uploader.upload(
  //   `data:${
  //     req.files.carInsurance[0].mimetype
  //   };base64,${req.files.carInsurance[0].buffer.toString("base64")}`,
  //   { folder: "driver-docs", resource_type: "raw", timeout: 120000 }
  // );

  const driverLicensePath = `/uploads/${req.files.driverLicense[0].filename}`;
  const carInsurancePath = `/uploads/${req.files.carInsurance[0].filename}`;

  const hashedPassword = await driverModel.hashPassword(password);

  const captain = await driverServices.createCaptain({
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
      path: driverLicensePath,
      uploadDate: new Date(),
      expiryDate: driverLicenseExpiryDate,
    },
    carInsurance: {
      path: carInsurancePath,
      uploadDate: new Date(),
      expiryDate: carInsuranceExpiryDate,
    },
  });

  const otp = randomString();
  const to = email;
  otpController.sendOtp(to, otp);

  //save otp to db
  captain.otp.code = otp;
  await captain.save();

  res.status(201).json({ token, captain });
};

module.exports.verify = async (req, res, next) => {
  const { email, otp } = req.body;

  const driver = await driverModel
    .findOne({
      email,
    })
    .select("+otp.code");

  if (!driver) {
    return res.status(404).json({ message: "Driver not found" });
  }

  if (driver.otp.code !== parseInt(otp)) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  //update driver otp to verified
  driver.otp.verified = true;
  await driver.save();

  const token = driver.generateAuthToken();
  return res.status(200).json({ token, driver });
};

module.exports.loginCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const captain = await driverModel.findOne({ email }).select("+password");

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
