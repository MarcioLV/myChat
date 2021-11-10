const mysql = require("mysql");
const fs = require("fs").promises;
const config = require("../../../config");

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
      createTables();
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

function createTables() {
  return new Promise((resolve, reject) => {
    connection.query(
      `CREATE TABLE IF NOT EXISTS
    users (user_id INTEGER unsigned primary key auto_increment not null,
    name varchar(64) not null,
    avatar varchar(256));`,
      (err, data) => {
        if (err) return reject(err);
      }
    );
    connection.query(
      `CREATE TABLE IF NOT EXISTS
    chats (chat_id INTEGER unsigned primary key auto_increment not null,
    user1_id INTEGER unsigned not null,
    user2_id INTEGER unsigned not null);`,
      (err, data) => {
        if (err) return reject(err);
      }
    );
    connection.query(
      `CREATE TABLE IF NOT EXISTS
    messages (message_id INTEGER unsigned primary key auto_increment not null,
    chat_id INTEGER unsigned not null,
    user INTEGER unsigned not null,
    message text,
    file varchar(256),
    date varchar(64) not null,
    seen tinyint(1) not null default 0);`,
      (err, data) => {
        if (err) return reject(err);
      }
    );
  });
}

function list(table, filterName) {
  let filter = "";
  if (filterName) {
    filter = ` WHERE name="${filterName}" COLLATE utf8mb3_bin`;
  }
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM ${table}` + filter, (err, data) => {
      if (err) return reject(err);
      if (filterName) {
        return resolve(data[0]);
      }
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

async function getMessages(table, chat_id, userId) {
  let messages = await new Promise((resolve, reject) => {
    connection.query(
      `SELECT*FROM ${table} WHERE chat_id=${chat_id}`,
      (err, data) => {
        if (err) return reject(err);
        resolve(data);
      }
    );
  });
  let filterMessages = messages.filter(
    (e) => e.seen === 0 && e.user !== userId
  );
  if (filterMessages.length > 0) {
    let query = "";
    filterMessages.forEach((msg, index) => {
      if (index !== 0) {
        query += " OR ";
      }
      query += `message_id=${msg.message_id}`;
    });
    let update = await new Promise((resolve, reject) => {
      connection.query(
        `UPDATE messages SET seen=1 WHERE ${query}`,
        (err, data) => {
          if (err) return reject(err);
          resolve(data);
        }
      );
    });
  }
  return messages;
}

function updateMessage(table, msj_id) {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE ${table} SET seen=1 WHERE message_id=${msj_id} limit 1`,
      (err, data) => {
        if (err) return reject(err);
        resolve(data);
      }
    );
  });
}

function addUser(table, name) {
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO ${table} (name) VALUES ("${name}")`,
      (err, data) => {
        if (err) return reject(err);
        resolve(data);
      }
    );
  });
}

async function addAvatar(table, user, file) {
  const userAvatar = await new Promise((resolve, reject) => {
    connection.query(
      `SELECT avatar FROM ${table} WHERE user_id=${user}`,
      (err, data) => {
        if (err) return reject(err);
        resolve(data[0].avatar);
      }
    );
  });
  if (userAvatar && userAvatar !== "") {
    const oldFileUrl = userAvatar.split("/");
    const oldFileName = oldFileUrl[oldFileUrl.length - 1];
    fs.unlink("./src/server/public/files/avatars/" + oldFileName)
      .then(() => {
        console.log("File removed");
      })
      .catch((err) => {
        console.error("error", err);
      });
  }
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE ${table} SET avatar="${file}" WHERE user_id=${user} limit 1`,
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
      `SELECT c.chat_id, user1_id, user2_id, max(m.message_id) as message_id,
      (SELECT count(seen)
      FROM messages
      WHERE seen=0 and chat_id=c.chat_id and user<>${user._id}
      ) as seen
      FROM chats as c
      JOIN messages as m
      ON c.chat_id=m.chat_id
      WHERE user1_id=${user._id} OR user2_id=${user._id}
      GROUP BY c.chat_id
      ORDER BY message_id desc;`,
      (err, data) => {
        if (err) return reject(err);
        resolve(data);
      }
    );
  });
  let response = [];
  if (datos.length !== 0) {
    let query = "";
    let number;
    datos.forEach((chat, index) => {
      number = chat.user1_id;
      response.push({ chat_id: chat.chat_id, seen: chat.seen });
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
      element.avatar = elem.avatar;
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
      resolve({
        data: data,
        message: { ...message, message_id: data.insertId },
      });
    });
  });
}

module.exports = {
  list,
  getUser,
  getUserName,
  addUser,
  addAvatar,
  listChat,
  addChat,
  getMessages,
  addMessage,
  updateMessage,
};
