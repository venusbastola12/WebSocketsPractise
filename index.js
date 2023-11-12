const http = require("http");
const { join } = require("node:path");
const express = require("express");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server);
io.on("connection", (socket) => {
  socket.on("user-message", (message) => {
    console.log("new message from user:", message);
    io.emit("message", message);
  });
  // socket.on("disconnect", () => {
  //   console.log("user disconnected from this tab");
  // });
});
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "./public/index.html"));
});
server.listen(3000, () => {
  console.log("server running at port 3000");
});
