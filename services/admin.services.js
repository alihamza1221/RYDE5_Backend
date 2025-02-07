const adminModel = require("../models/admin.model");

module.exports.createAdmin = async ({ password }) => {
  if (!password) {
    throw new Error("All fields are required");
  }
  const admin = await adminModel.create({
    password,
  });

  return admin;
};
