const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true }
);

adminSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.ADMIN_JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

adminSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

adminSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const adminModel = mongoose.model("admin", adminSchema);

module.exports = adminModel;
