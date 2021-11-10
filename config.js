const dotenv = require('dotenv').config()
module.exports = {
  api: {
    host: process.env.API_URL || "http://localhost:3000",
    name: "api"
  },

  mysql: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB, 
  },
};