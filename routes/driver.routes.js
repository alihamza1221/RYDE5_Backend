const captainController = require("../controllers/driver.controller");
const multer = require("multer");
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../utils/multer.config");
const { upload: imageUpload } = require("../utils/image.config.multer");

router.post(
  "/register",
  upload.fields([
    { name: "driverLicense", maxCount: 1 },
    { name: "carInsurance", maxCount: 1 },
  ]),
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullname")
      .isLength({ min: 3 })
      .withMessage("Full name must be at least 3 characters long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  captainController.registerCaptain
);

router.post("/verify", captainController.verify);
router.post("/set2FA", authMiddleware.authDriver, captainController.set2FA);
router.post("requestOtp", captainController.requestOtp);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  captainController.loginCaptain
);

router.get(
  "/profile",
  authMiddleware.authDriver,
  captainController.getCaptainProfile
);
router.post(
  "/uploadImage",
  authMiddleware.authDriver,
  imageUpload.single("profileImage"),
  captainController.uploadImage
);

router.get(
  "/logout",
  authMiddleware.authDriver,
  captainController.logoutCaptain
);

module.exports = router;
