const { Server } = require("socket.io");
const { getUserName } = require("./store/mysql");
const socket = {users: []};

function connect(server) {
  socket.io = new Server(server, {
    cors: {
      origins: ["*"],
    },
  });
}

function addUser(userId, socketId){
  socket.users = [...socket.users, {user_id: userId, socket_id: socketId}]
}

async function sendMessage(userId, msj){
  msj.chat_id = parseInt(msj.chat_id)
  msj.user = parseInt(msj.user)
  const user = socket.users.find(e => e.user_id === parseInt(userId))
  if(user){
    const userName = await getUserName(parseInt(msj.user))
    const name = userName[0]
    socket.io.to(user.socket_id).emit("message", {...msj, ...name})
  }
}

function leftUser(socketId){
  const userIndex = socket.users.findIndex(e => e.socket_id === socketId) 
  if(userIndex !== -1){
    socket.users.splice(userIndex, 1)
  }
}


module.exports = {
  connect,
  addUser,
  sendMessage,
  leftUser,
  socket,
};
