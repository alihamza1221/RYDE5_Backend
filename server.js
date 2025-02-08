const http = require("http");

const app = require("./app");
// const { initializeSocket } = require("./socket");
const port = process.env.PORT || 3000;
const dotenv = require("dotenv");

dotenv.config();

const server = http.createServer(app);

// initializeSocket(server);

app.get("/", (_, res) =>
  res.json({ message: "Welcome to Ryde5 App backend." })
);

server.listen(port, (err) => {
  if (err) {
    console.error("Error starting server:", err);
    return;
  }
  console.log(`Server is running on port ${port}`);
});
