const userModel = require("../models/user.model");

module.exports.createUser = async ({ fullname, email, phoneNo, password }) => {
  if (!fullname || !email || !password || !phoneNo) {
    throw new Error("All fields are required");
  }
  const user = await userModel.create({
    fullname,
    email,
    phoneNo,
    password,
  });

  return user;
};
