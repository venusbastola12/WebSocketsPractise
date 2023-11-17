const http = require("http");
const { join } = require("node:path");
const express = require("express");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
  },
}); // here we create a instance of a socket server.
io.on("connection", (socket) => {
  // when the socket server is connected to any client or sockets then we apply following
  socket.on("user-message", async (message) => {
    console.log("new message from user:", message);
    io.emit("message", message); //it is used to emit message to all the client connected to the host
    const sockets = await io.fetchSockets();
    console.log("connected sockets are:", sockets);
  });
  // socket.on("disconnect", () => {
  //   console.log("user disconnected from this tab");
  // });
});
// const count = io.engine.clientsCount;     it is used to count the no of user connected with the socket server..
// console.log("the no of client connected now are: ", count);
io.engine.on("initial_headers", (headers, req) => {
  //special events emitted by engine.IO server
  console.log("first handshake completed time to send response to request..");
  //console.log(headers);
});
io.engine.on("headers", (headers) => {
  //headers is the event which is emitted in the every http request during first connection.
  //console.log(headers);
  console.log("here headers event is handled");
});
io.engine.on("connection_error", (err) => {
  //connection_error is the event emitted when an abnormal disconnection is occured.
  console.log(err);
});

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "./public/index.html"));
});
server.listen(3000, () => {
  console.log("server running at port 3000");
});
