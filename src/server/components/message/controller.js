const store = require("../../store/mysql")

const TABLA = "messages"

function list(){
  return store.list(TABLA)
}

function getMessages(id){
  if(!id){
    return Promise.reject('No viene Chat_ID');
  }
  return store.getMessages(TABLA, id)
}

async function addMessage(chat, user, message){
  if(!chat || !user || !message){
    return Promise.reject("not info")
  }
  const mensaje = {
    chat_id: chat,
    user: user,
    message: message,
    date: new Date()
  }

  return store.addMessage(TABLA, mensaje)
  // if(msg.message){
  //   sendMessage(userTo, msg.message)
  // }
  // return msg
}

module.exports = {
  addMessage,
  list,
  getMessages
}