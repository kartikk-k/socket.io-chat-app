const app = require("express")();

const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

// simple socket - everyone at onc place
io.on("connection", (socket) => {
  console.log("this is socket", socket);

  socket.on("chat", (payload) => {
    console.log("this is payload", payload);

    io.emit("chat", payload);
  });
});


// rooms socket - multiple users in a room
const roomNamespace = io.of("/room");

roomNamespace.on("connection", (socket) => {

  // joining room with roomId
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  // receives message from client and returns same to particular room
  socket.on("message", (payload) => {
    const { roomId, message, username } = payload;
    console.log(`Received message in room ${roomId}: ${message}`);

    roomNamespace.to(roomId).emit("message", payload); // Sending the message back to the room
  });

});

// don't do this
// app.listen(8080, () => console.log("server is running on port 8080"));

// do this
server.listen(8080, () => console.log("server is running on port 8080"));
