const captainModel = require("../models/captain.model");

module.exports.createCaptain = async ({
  fullname,
  email,
  password,
  color,
  plate,
  capacity,
  vehicleType,
  driverLicense,
  carInsurance,
}) => {
  if (
    !firstname ||
    !email ||
    !password ||
    !color ||
    !plate ||
    !capacity ||
    !vehicleType ||
    !driverLicense ||
    !carInsurance ||
    !phoneNo
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
    },
    docs: {
      driverLicense,
      carInsurance,
    },
  });

  return captain;
};
