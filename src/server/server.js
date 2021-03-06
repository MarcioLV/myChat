const express = require("express");
const app = express();
const server = require("http").createServer(app);

require('dotenv').config()

const socket = require("./socket");
const {addUser, leftUser, sendMessage} = require("./socket")

const path = require("path");
const cors = require("cors");
const config = require("../../config");
const errors = require("./network/error");
const router = require("./network/routes");

const port = process.env.PORT || 3000

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

router(app);

socket.connect(server);
const {io} = socket.socket

io.on("connection", (socket) => {
  socket.on("login", (user) => {
    addUser(user, socket.id)
  });
  socket.on("disconnect", () => {
    leftUser(socket.id)
  });
});

app.use(errors);

app.use('/', express.static(path.join(__dirname, "./public")))
app.use('/', express.static(path.join(__dirname, "./public/dist")))

app.get("*/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/dist/index.html"))
})

server.listen(port, (err) => {
  if (err) {
    console.error("Error", err);
  } else {
    console.log("Servidor escuchando en el puerto " + port);
  }
});
