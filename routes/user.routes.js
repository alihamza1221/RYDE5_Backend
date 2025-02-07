const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const otpController = require("../controllers/otp.controller");
const multerUpload = require("../utils/image.config.multer");

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullname")
      .isLength({ min: 3 })
      .withMessage("Full name must be at least 3 characters long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  userController.registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  userController.loginUser
);

router.post("/verify", userController.verifyUser);
router.post("/set2FA", authMiddleware.authUser, userController.set2FA);
router.post("requestOtp", userController.requestOtp);

router.get("/profile", authMiddleware.authUser, userController.getUserProfile);
router.post(
  "/uploadImage",
  authMiddleware.authUser,
  multerUpload.upload.single("profileImage"),
  userController.uploadImage
);

router.patch(
  "/updateUserInfo",
  authMiddleware.authUser,
  [
    body("email").optional().isEmail().withMessage("Invalid email format"),
    body("phone")
      .optional()
      .isLength({ min: 10 })
      .withMessage("Invalid phone number format"),
  ],
  userController.updateUserInfo
);

router.get("/logout", authMiddleware.authUser, userController.logoutUser);

module.exports = router;
