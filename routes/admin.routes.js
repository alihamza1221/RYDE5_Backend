const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth.middleware");
const adminController = require("../controllers/admin.controller/admin.controller");
const dashboardController = require("../controllers/admin.controller/dashboard.controller");
const multerUpload = require("../utils/image.config.multer");
const adminActionsController = require("../controllers/admin.controller/actions.admin");
const upload_doc = require("../utils/multer.config");

router.post(
  "/register",
  [
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  adminController.registerAdmin
);

router.post(
  "/login",
  [
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  adminController.loginAdmin
);

router.get(
  "/profile",
  authMiddleware.authAdmin,
  adminController.getAdminProfile
);

router.get("/logout", authMiddleware.authAdmin, adminController.logoutAdmin);

/*DASHBOARD */
router.get(
  "/dashboardDataBrief",
  authMiddleware.authAdmin,
  dashboardController.dashboardDataBrief
);

/*USER INFO */
router.get(
  "/getUsersDetails",
  authMiddleware.authAdmin,
  dashboardController.getUsersDetails
);
router.post(
  "/users/getFilteredUsers",
  authMiddleware.authAdmin,
  dashboardController.getFilteredUsers
);

router.get(
  "/users/searchUsers",
  authMiddleware.authAdmin,
  dashboardController.searchUsers
);

/*DRIVER INFO */

router.get(
  "/getDriversDetails",
  authMiddleware.authAdmin,
  dashboardController.getDriversDetails
);

router.post(
  "/drivers/getFilteredDrivers",
  authMiddleware.authAdmin,
  dashboardController.getFilteredDrivers
);

router.get(
  "/drivers/searchDrivers",
  authMiddleware.authAdmin,
  dashboardController.searchDrivers
);

router.post(
  "/drivers/getDriversByVehicleType",
  authMiddleware.authAdmin,
  dashboardController.getDriversByVehicleType
);

router.post(
  "/drivers/vehicle_image",
  authMiddleware.authAdmin,
  multerUpload.upload.single("vehicleImage"),
  dashboardController.uploadVehicleImage
);

/* DRVIVER ACTIOINS */
router.post(
  "/setUserStatus",
  authMiddleware.authAdmin,
  adminActionsController.setUserStatus
);

router.post(
  "/deleteUser",
  authMiddleware.authAdmin,
  adminActionsController.deleteUser
);
// router.post(
//   "/verifyDriverDocs",
//   authMiddleware.authAdmin,
//   [
//     body("email").isEmail().withMessage("Invalid email format"),
//     body("docType")
//       .isIn(["driverLicense", "carInsurance"])
//       .withMessage("Invalid document type"),
//     body("status").isBoolean().withMessage("Status must be a boolean"),
//   ],
//   adminController.verifyDriverDocs
// );

//userId, identity, email, fullname
router.patch(
  "/updateUserInfo",
  [
    body("userId").notEmpty().withMessage("userId is required"),
    body("identity")
      .notEmpty()
      .isIn(["user", "driver"])
      .withMessage("identity must be either 'user' or 'driver'"),
    body("email").optional().isEmail().withMessage("Invalid email format"),
    body("fullname")
      .optional()
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long"),
  ],
  authMiddleware.authAdmin,
  adminActionsController.updateUserInfo
);

router.post(
  "/uploadDocument",
  authMiddleware.authAdmin,
  upload_doc.single("document"),
  [
    body("category")
      .isIn(["guidelines", "forms", "legal"])
      .withMessage("Invalid category"),
    body("status").isIn(["active", "archived"]).withMessage("Invalid status"),
  ],
  dashboardController.uploadAdminDocument
);

router.get(
  "/documents",
  authMiddleware.authAdmin,
  dashboardController.getAdminDocuments
);

router.get(
  "/searchDocuments",
  authMiddleware.authAdmin,
  dashboardController.searchAdminDocuments
);

router.get(
  "/getFilteredDocuments",
  authMiddleware.authAdmin,
  dashboardController.getFilteredDocuments
);

module.exports = router;
