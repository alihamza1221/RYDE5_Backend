const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth.middleware");
const adminController = require("../controllers/admin.controller/admin.controller");
const dashboardController = require("../controllers/admin.controller/dashboard.controller");
const multer = require("multer");

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
// User Routes
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

const upload = multer({
  storage: multer.diskStorage({
    destination: "vehicleImage/",
    filename: (req, file, cb) => {
      cb(null, `vehicle-${Date.now()}${path.extname(file.originalname)}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.post(
  "/drivers/vehicle_image",
  authMiddleware.authAdmin,
  upload.single("vehicleImage"),
  dashboardController.uploadVehicleImage
);
module.exports = router;
