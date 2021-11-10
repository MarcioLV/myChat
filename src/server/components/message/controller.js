const store = require("../../store/mysql")
const config = require("../../../../config");

const TABLA = "messages"


function list(){
  return store.list(TABLA)
}

function getMessages(chat_id, userId){
  if(!chat_id || !userId){
    return Promise.reject('No viene data');
  }

  return store.getMessages(TABLA, chat_id, userId)
}

async function addMessage(chat, user, message, picture){
  if(!chat || !user){
    if(!message && !picture){
      return Promise.reject("not info")
    }
  }
  
  const moment = require('moment-timezone')
  let date = new Date()
  date = moment(date)
  date = date.tz('America/Argentina/Buenos_Aires')
  date = date.toString()

  const mensaje = {
    chat_id: chat,
    user: user,
    message: message,
    date: date
  }

  if(picture){
    mensaje.file = `files/pictures/${picture.filename}`;
  }

  const data = await store.addMessage(TABLA, mensaje)
  return {...data, data: {...data.data, file: mensaje.file}}
}

function updateMessage(msj_id){
  return store.updateMessage(TABLA, msj_id)
}

module.exports = {
  addMessage,
  list,
  getMessages,
  updateMessage
}
