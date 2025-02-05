const http = require("http");

const app = require("./app");
// const { initializeSocket } = require("./socket");
const port = process.env.PORT || 3000;
const dotenv = require("dotenv");
dotenv.config();

const server = http.createServer(app);

// initializeSocket(server);

server.listen(port, (err) => {
  if (err) {
    console.error("Error starting server:", err);
    return;
  }
  console.log(`Server is running on port ${port}`);
});

// const express = require("express");
// const app = express();
// const http = require("http");
// const server = http.createServer(app);

// app.get("/", (req, res) => {
//   res.send("<h1>Hello world</h1>");
// });

// server.listen(3000, () => {
//   console.log("listening on *:3000");
// });
