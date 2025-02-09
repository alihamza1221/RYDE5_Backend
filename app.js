const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");

const debugMiddleware = (req, res, next) => {
  console.log("Request path", req.path);
  next();
};

app.use(debugMiddleware);
const connectToDb = require("./db/db");
const userRoutes = require("./routes/user.routes");
const driverRoutes = require("./routes/driver.routes");
const adminRoutes = require("./routes/admin.routes");
// const mapsRoutes = require("./routes/maps.routes");
// const rideRoutes = require("./routes/ride.routes");

const buildPath = path.join(__dirname, "./next");
app.use(express.static(buildPath));

app.use("/uploads", express.static("uploads"));

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));

connectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/users", userRoutes);
app.use("/drivers", driverRoutes);
app.use("/admin", adminRoutes);
// app.use("/maps", mapsRoutes);
// app.use("/rides", rideRoutes);

app.get("*", (req, res) => {
  let requestedPath = path.join(buildPath, req.path);

  // Check if requestedPath refers to a directory and try adding ".html"
  if (fs.existsSync(requestedPath)) {
    // If it's a file, serve it
    if (fs.lstatSync(requestedPath).isFile()) {
      return res.sendFile(requestedPath);
    }
  } else {
    // Check if there's a .html file for the given route
    requestedPath = path.join(buildPath, req.path + ".html");
    if (fs.existsSync(requestedPath) && fs.lstatSync(requestedPath).isFile()) {
      return res.sendFile(requestedPath); // Serve .html file for dynamic routes
    }
  }

  // If no file is found, fallback to index.html (for dynamic routing)
  res.sendFile(path.join(buildPath, "404.html"));
});

module.exports = app;
