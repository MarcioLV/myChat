const mysql = require("mysql");
const { ids } = require("webpack");

const config = require("../../../config");
// const { sendMessage } = require("../socket");

const dbconf = {
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
};

let connection;
function handleConnect() {
  connection = mysql.createConnection(dbconf);
  connection.connect((err) => {
    if (err) {
      console.error("[db error]", err);
      setTimeout(handleConnect, 2000);
    } else {
      console.log("DB Conectada");
    }
  });
  connection.on("error", (err) => {
    console.error("[db err]", err);
    if (err.code === "PROTOCOL_CONECTION_LOST") {
      handleConnect();
    } else {
      throw err;
    }
  });
}
handleConnect();

function list(table) {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM ${table}`, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

function getUser(table, filterName) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM ${table} WHERE name like "%${filterName}%"`,
      (err, data) => {
        if (err) return reject(err);
        resolve(data);
      }
    );
  });
}

function getUserName(userId) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT name FROM users WHERE user_id=${userId}`,
      (err, data) => {
        if (err) return reject(err);
        resolve(data);
      }
    );
  });
}

function getMessages(table, chat_id) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT*FROM ${table} WHERE chat_id=${chat_id}`,
      (err, data) => {
        if (err) return reject(err);
        resolve(data);
      }
    );
  });
}

function addUser(table, user) {
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO ${table} (_id, username) VALUES ("${user._id}", "${user.username}")`,
      (err, data) => {
        if (err) return reject(err);
        resolve(data);
      }
    );
  });
}

async function listChat(table, user) {
  let datos = await new Promise((resolve, reject) => {
    connection.query(
      `SELECT*FROM ${table} WHERE user1_id="${user._id}" OR user2_id="${user._id}"`,
      (err, data) => {
        if (err) return reject(err);
        resolve(data);
      }
    );
  });

  let response = [];
  if(datos.length !== 0){
    let query = "";
    let number;
    datos.forEach((chat, index) => {
      number = chat.user1_id;
      response.push({ chat_id: chat.chat_id });
      if (index != 0) {
        query += "OR ";
      }
      if (user._id === number) {
        number = chat.user2_id;
      }
      query += "user_id=" + number + " ";
      response[index].user_id = number;
    });
    let otherUser = await new Promise((resolve, reject) => {
      connection.query(`SELECT*FROM users WHERE ${query}`, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  
    response.forEach((element, index) => {
      let elem = otherUser.find((e) => e.user_id === element.user_id);
      element.name = elem.name;
    });

  }
  return response;
}

function addChat(table, chat) {
  return new Promise((resolve, reject) => {
    connection.query(`INSERT INTO ${table} SET ?`, chat, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

function addMessage(table, message) {
  return new Promise((resolve, reject) => {
    connection.query(`INSERT INTO ${table} SET ?`, message, (err, data) => {
      if (err) return reject(err);
      resolve({data: data, message: {...message, message_id: data.insertId}});
    });
  });
}


module.exports = {
  list,
  getUser,
  getUserName,
  addUser,
  listChat,
  addChat,
  getMessages,
  addMessage,
};
