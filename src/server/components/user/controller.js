const store = require("../../store/mysql")

const { nanoid } = require("nanoid")

const TABLA = "users"

function list(){
  return store.list(TABLA)
}

function getUser(filterName){
  return store.getUser(TABLA, filterName)
}

function addUser(name){
  if(!name){
    return Promise.reject('invalid name')
  }
  const user = {
    _id: nanoid(),
    username: name
  }
  return store.addUser(TABLA, user)
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
}