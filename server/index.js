const express = require("express");
const app = express();
const PORT = 4000;

//New imports
const http = require("http").Server(app); // http significa q usa tcp
const cors = require("cors");

let users = [];

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:4444",
  },
}); // aqui inicial el socket io

app.use(cors());

//Add this before the app.get() block
socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  //Listens when a new user joins the server
  socket.on("newUser", (data) => {
    //Adds the new user to the list of users
    users.push(data);
    // console.log(users);
    //Sends the list of users to the client
    socketIO.emit("newUserResponse", users);
  });

  socket.on("typing", (data) => socket.broadcast.emit("typingResponse", data)); // para maddarselo a todo los demas el mesanje de typing

  //sends the message to all the users on the server
  socket.on("message", (data) => {
    socketIO.emit("messageResponse", data); // reenvia mensaje a todos los socket conectados
  });

  //Listens and logs the message to the console
  socket.on("message", (data) => {
    console.log(data);
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
    //Updates the list of users when a user disconnects from the server
    users = users.filter((user) => user.socketID !== socket.id);
    // console.log(users);
    //Sends the list of users to the client
    socketIO.emit("newUserResponse", users);
    socket.disconnect();
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
