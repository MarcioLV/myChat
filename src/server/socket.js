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
  const user = socket.users.find(e => e.user_id === userId)
  if(user){
    const userName = await getUserName(msj.user)
    const name = userName[0]
    socket.io.to(user.socket_id).emit("message", {...msj, ...name})
  }
}

function leftUser(socketId){
  const userIndex = socket.users.findIndex(e => e.socket_id === socketId) 
  socket.users.splice(userIndex, 1)
}


module.exports = {
  connect,
  addUser,
  sendMessage,
  leftUser,
  socket,
};
