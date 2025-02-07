const captainModel = require("../models/driver.model");

module.exports.createCaptain = async ({
  fullname,
  email,
  phoneNo,
  password,
  color,
  plate,
  capacity,
  vehicleType,
  vehicleModel,
  driverLicense,
  carInsurance,
}) => {
  if (
    !fullname ||
    !email ||
    !password ||
    !color ||
    !plate ||
    !capacity ||
    !vehicleType ||
    !driverLicense ||
    !carInsurance ||
    !vehicleModel
  ) {
    throw new Error("All fields are required");
  }
  const captain = captainModel.create({
    fullname,
    email,
    phoneNo,
    password,
    vehicle: {
      color,
      plate,
      capacity,
      vehicleType,
      vehicleModel,
    },
    docs: {
      driverLicense,
      carInsurance,
    },
  });

  return captain;
};
