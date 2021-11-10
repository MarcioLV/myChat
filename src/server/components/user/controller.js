const store = require("../../store/mysql")
const config = require("../../../../config");

const TABLA = "users"

function list(filterName){
  return store.list(TABLA, filterName)
}

function getUser(filterName){
  return store.getUser(TABLA, filterName)
}

async function addUser(name){
  if(!name){
    return Promise.reject('invalid name')
  }
  const taken = await store.list(TABLA, name)
  if(taken){
    return false
  }
  // const user = {name: name}
  const add = await store.addUser(TABLA, name)
  return add
}

async function addAvatar(user, avatar){
  let fileUrl = ''
  if(avatar){
    fileUrl = `files/avatars/${avatar.filename}`;
  }
  const data = store.addAvatar(TABLA, user, fileUrl);
  return {...data, file: fileUrl}
}

// function getUser(filterName){
//   return new Promise((res, rej) => {
//     res(store.list(filterName))
//   })
// }

module.exports = {
  list,
  addUser,
  getUser,
  addAvatar
}