const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const driverSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      minlength: [3, "Full Name must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phoneNo: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    image: {
      type: String,
      default: "default.jpg",
    },
    socketId: {
      type: String,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },

    vehicle: {
      color: {
        type: String,
        required: true,
        minlength: [3, "Color must be at least 3 characters long"],
      },
      plate: {
        type: String,
        required: true,
        minlength: [1, "Plate must be at least 1 characters long"],
      },
      capacity: {
        type: Number,
        required: true,
        min: [1, "Capacity must be at least 1"],
      },
      vehicleType: {
        type: String,
        required: true,
        enum: ["car", "motorcycle", "auto"],
      },
      vehicleModel: {
        type: String,
        required: true,
        min: [1, "Vehicle model must be at least 1 characters long"],
      },
      image: {
        type: String,
      },
    },

    location: {
      ltd: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },
    docs: {
      driverLicense: {
        path: {
          type: String,
        },
        uploadDate: {
          type: Date,
          default: Date.now,
        },
        expiryDate: {
          type: Date,
          required: true,
        },
        isVerified: {
          type: Boolean,
          default: false,
        },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
      },
      carInsurance: {
        path: {
          type: String,
        },
        uploadDate: {
          type: Date,
          default: Date.now,
        },
        expiryDate: {
          type: Date,
          required: true,
        },
        isVerified: {
          type: Boolean,
          default: false,
        },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
      },
    },
    otp: {
      verified: {
        type: Boolean,
        default: false,
      },
      code: {
        type: Number,
      },
    },
    twoFactor: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

driverSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "90h",
  });
  return token;
};

driverSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

driverSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const driverModel =
  mongoose.models.driver || mongoose.model("driver", driverSchema);

module.exports = driverModel;
