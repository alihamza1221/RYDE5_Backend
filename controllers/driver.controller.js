const driverModel = require("../models/driver.model");
const driverServices = require("../services/driver.services");
const blackListTokenModel = require("../models/blackListToken.model");
const { validationResult } = require("express-validator");
const otpController = require("../controllers/otp.controller");
const { randomString } = require("../utils/randomString");

module.exports.registerCaptain = async (req, res, next) => {
  try {
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
      return res.status(400).json({ message });
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
    await otpController.sendOtp(to, otp);

    //save otp to db
    captain.otp.code = otp;
    await captain.save();

    captain.otp.code = null;
    captain.otp.verified = false;
    return res.status(201).json({
      captain,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
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
  res.cookie("token", token);

  return res.status(200).json({ token, driver });
};

module.exports.set2FA = async (req, res, next) => {
  try {
    const driverId = req.captain._id ?? req.body.driverId;
    const status = req.body.status;

    const driver = await driverModel.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: "Unmatched fields error" });
    }

    // set twofactor status
    driver.twoFactor = status ? true : false;
    await driver.save();

    return res.status(200).json({
      message: "2FA setup status changed to " + status,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
module.exports.requestOtp = async (req, res, next) => {
  try {
    const email = req.body.email;

    const driver = await driverModel.findOne({ email });
    if (!driver) {
      return res.status(404).json({ message: "Unmatched fields error" });
    }

    const otp = randomString();
    const to = driver.email;
    await otpController.sendOtp(to, otp);

    //save otp to db
    driver.otp.code = otp;
    console.log("otp", otp);
    await driver.save();
    console.log("driver", driver);

    res.status(200).json({
      message: "otp successfully sent to your email",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports.loginCaptain = async (req, res, next) => {
  try {
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

    // if (!captain.otp.verified) {
    //   return res.status(401).json({
    //     message: "Please verify your account first or request for new otp",
    //   });
    // }

    if (!captain.twoFactor) {
      const token = captain.generateAuthToken();
      res.cookie("token", token);
      return res.status(200).json({
        token,
        captain,
      });
    }

    const otp = randomString();
    otpController.sendOtp(email, otp);
    captain.otp.code = otp;
    captain.otp.verified = false;
    await captain.save();

    captain.otp.code = null;
    return res.status(200).json({
      message: "OTP has been sent to your email",
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.getCaptainProfile = async (req, res, next) => {
  res.status(200).json({ captain: req.captain });
};

module.exports.logoutCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  await blackListTokenModel.create({ token });

  res.clearCookie("token");

  res.status(200).json({ message: "Logout successfully" });
};

module.exports.uploadImage = async (req, res, next) => {
  try {
    const driverId = req.captain._id ?? req.body.driverId;

    if (!req.file) {
      return res.status(400).json({
        message: "Profile image is required",
      });
    }

    const imagePath = `/upload/${req.file.filename}`;

    console.log("imagepath;", imagePath);
    //return updated user
    const driver = await driverModel.findById(driverId).select("-password");
    if (!driver) {
      return res.status(404).json({
        message: "Driver not found",
      });
    }
    driver.image = imagePath;
    await driver.save();

    console.log("driver", driver);
    return res.status(200).json({
      message: "Profile image uploaded successfully",
      driver,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.uploadDocuments = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Document is required" });
    }

    const { docType, driverId, expiryDate } = req.body;

    const _driver_id = req?.captain?._id ?? driverId;
    const documentPath = `/uploads/${req.file.filename}`;

    const driver = await driverModel.findById(_driver_id);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    driver.docs[docType].path = documentPath;
    driver.docs[docType].uploadDate = new Date();
    driver.docs[docType].expiryDate = expiryDate;

    await driver.save();

    res.status(200).json({
      message: "Document uploaded successfully",
      driver,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const driver = await driverModel.findOne({ email });
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const newPassword = randomString();
    const hashedPassword = await driverModel.hashPassword(newPassword);

    driver.password = hashedPassword;
    await driver.save();
    await otpController.sendOtp(email, newPassword);

    res.status(200).json({
      message: "New password has been sent to your email",
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
