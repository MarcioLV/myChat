const store = require("../../store/mysql")

const TABLA = "chats"

function list(){
  return store.list(TABLA)
}

function listChat(id){
  if(!id){
    return Promise.reject("not id")
  }
  const user = {
    _id: parseInt(id)
  }
  return store.listChat(TABLA, user)
}

function addChat(users){
  if(!users || !users.userFrom || !users.userTo){
    return Promise.reject("invalid user list")
  }
  const chat = {
    user1_id: users.userFrom,
    user2_id: users.userTo
  }
  return store.addChat(TABLA, chat)
}

module.exports = {
  addChat,
  list,
  listChat
}