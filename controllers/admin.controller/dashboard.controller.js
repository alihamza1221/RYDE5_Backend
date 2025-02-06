const { validationResult } = require("express-validator");
// const blackListTokenModel = require("../models/blackListToken.model");
const userModel = require("../../models/user.model");
const driverModel = require("../../models/driver.model");

module.exports.dashboardDataBrief = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const totalUsers = await userModel.countDocuments();
  //TODO: Total Rides, Revenue , AVG Ratings, Real Time Tracking

  const usersOverView = await userModel
    .find()
    .select("fullname email status createdAt")
    .sort({ createdAt: -1 })
    .limit(3);

  const driversOverView = await driverModel
    .find()
    .select("fullname email status vehicle.vehicleModel createdAt")
    .sort({ createdAt: -1 })
    .limit(3);

  //TODO:Recent Reviews
  //TODO:Emergency Alerts

  res.status(200).json({
    totalUsers,
    usersOverView,
    driversOverView,
  });
};

module.exports.getUsersDetails = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const totalUsers = await userModel.countDocuments();

    const users = await userModel
      .find()
      .select("fullname email status createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.getFilteredUsers = async (req, res, next) => {
  try {
    const { status } = req.body;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Validate status
    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be 'active' or 'inactive'",
      });
    }

    const totalUsers = await userModel.countDocuments({ status });

    const users = await userModel
      .find({ status })
      .select("fullname email status createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
      status,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.searchUsers = async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email || email.length == 0) {
      return res.status(400).json({
        users: [],
        count: 0,
      });
    }

    const users = await userModel
      .find({
        email: {
          $regex: `.*${email}.*`,
          $options: "i",
        },
      })
      .select("fullname email status createdAt")
      .sort({ createdAt: -1 })
      .limit(6); // Limit results for performance

    res.status(200).json({
      users,
      count: users.length,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/* INFO ABOUT DRIVER */

module.exports.getDriversDetails = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const totalDrivers = await driverModel.countDocuments();

    const drivers = await driverModel
      .find()
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      drivers,
      currentPage: page,
      totalPages: Math.ceil(totalDrivers / limit),
      totalDrivers,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.getFilteredDrivers = async (req, res, next) => {
  try {
    const { status } = req.body;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Validate status
    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be 'active' or 'inactive'",
      });
    }

    const totalDrivers = await driverModel.countDocuments({ status });

    const drivers = await driverModel
      .find({ status })
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      drivers,
      currentPage: page,
      totalPages: Math.ceil(totalDrivers / limit),
      totalDrivers,
      status,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.searchDrivers = async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email || email.length == 0) {
      return res.status(400).json({
        drivers: [],
        count: 0,
      });
    }

    const drivers = await driverModel
      .find({
        email: {
          $regex: `.*${email}.*`,
          $options: "i",
        },
      })
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      drivers,
      count: drivers.length,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.getDriversByVehicleType = async (req, res, next) => {
  try {
    const { vehicleType } = req.body;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Validate vehicle type
    if (!["X", "XL"].includes(vehicleType)) {
      return res.status(400).json({
        message: "Invalid vehicle type. Must be 'car', 'X', or 'XL'",
      });
    }

    const totalDrivers = await driverModel.countDocuments({
      "vehicle.vehicleType": vehicleType,
    });

    const drivers = await driverModel
      .find({ "vehicle.vehicleType": vehicleType })
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      drivers,
      currentPage: page,
      totalPages: Math.ceil(totalDrivers / limit),
      totalDrivers,
      vehicleType,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.uploadVehicleImage = async (req, res, next) => {
  try {
    const { driverId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Vehicle image is required",
      });
    }

    const imagePath = `/vehicleImage/${req.file.filename}`;

    const driver = await driverModel
      .findByIdAndUpdate(
        driverId,
        {
          "vehicle.image": imagePath,
        },
        { new: true }
      )
      .select("-password");

    if (!driver) {
      return res.status(404).json({
        message: "Driver not found",
      });
    }

    res.status(200).json({
      message: "Vehicle image uploaded successfully",
      driver,
    });
  } catch (error) {
    next(error);
  }
};

//TODS: ADMIN DASHBOARD REQ
