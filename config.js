const dotenv = require('dotenv').config()
module.exports = {
  api: {
    host: process.env.HOST || "http://localhost:3000",
    name: process.env.NAME || "api"
  },

  mysql: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB, 
  },
};