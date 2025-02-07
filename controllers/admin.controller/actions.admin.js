const { validationResult } = require("express-validator");
// const blackListTokenModel = require("../models/blackListToken.model");
const userModel = require("../../models/user.model");
const driverModel = require("../../models/driver.model");
const blacklistUserModel = require("../../models/blackListUser.model");

module.exports.setUserStatus = async (req, res, next) => {
  try {
    const { userId, identity, status } = req.body;

    // Validate inputs
    if (!userId || !identity || !status) {
      return res.status(400).json({
        message: "userId, identity and status are required",
      });
    }

    // Validate status
    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        message: "Status must be either 'active' or 'inactive'",
      });
    }

    // Select model based on userType
    const Model = userType === "driver" ? driverModel : userModel;

    const user = await Model.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: `${userType} not found`,
      });
    }

    //change blocklist token
    if (status === "inactive") {
      await blacklistUserModel.create({ userId });
    }
    /*If status updates to active remove from blocklist */
    if (status === "active") {
      await blacklistUserModel.findOneAndDelete({ userId });
    }

    return res.status(200).json({
      message: `${identity} status updated successfully`,
      user,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports.deleteUser = async (req, res, next) => {
  try {
    const { userId, identity } = req.body;

    const Model = identity === "driver" ? driverModel : userModel;

    const user = await Model.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        message: `${identity} not found`,
      });
    }

    // Remove from blacklist if exists
    await blacklistUserModel.findOneAndDelete({ userId });

    res.status(200).json({
      message: `${identity} deleted successfully`,
      deletedUser: user,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.updateUserInfo = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, identity, email, fullname } = req.body;

    // Create update object with only provided fields
    const updateData = {};
    if (email) updateData.email = email;
    if (fullname) updateData.fullname = fullname;

    // Select model based on identity
    const Model = identity === "driver" ? driverModel : userModel;

    const user = await Model.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        message: `${identity} not found`,
      });
    }
    console.log("user", user);

    res.status(200).json({
      message: `${identity} information updated successfully`,
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error updating user information",
    });
  }
};
