const captainController = require("../controllers/driver.controller");
const multer = require("multer");
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../utils/multer.config");
const multerUpload = require("../utils/image.config.multer");

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
    body("phoneNo").notEmpty().isNumeric().isLength({ min: 10 }),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  captainController.registerCaptain
);

router.post("/verify", captainController.verify);
router.post("/set2FA", authMiddleware.authDriver, captainController.set2FA);
router.post("/requestOtp", captainController.requestOtp);

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
  multerUpload.upload.single("profileImage"),
  captainController.uploadImage
);

router.post(
  "/uploadDocuments",
  authMiddleware.authDriver,
  upload.single("document"),
  [
    body("driverId").optional().notEmpty().withMessage("Driver ID is required"),
    body("docType")
      .isIn(["driverLicense", "carInsurance"])
      .withMessage("Invalid document type"),
    body("expiryDate").notEmpty().withMessage("Invalid expiry date"),
  ],
  captainController.uploadDocuments
);

router.patch(
  "/forgotPassword",
  [body("email").isEmail().withMessage("Invalid email format")],
  captainController.forgotPassword
);

router.get(
  "/logout",
  authMiddleware.authDriver,
  captainController.logoutCaptain
);

module.exports = router;
