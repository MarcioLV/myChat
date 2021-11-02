module.exports = {
  api: {
    host: process.env.HOST || "https://mychatjs.herokuapp.com/",
    port: process.env.PORT,
    name: process.env.NAME || "api"
  },

  mysql: {
    host: process.env.MYSQL_HOST || "remotemysql.com",
    user: process.env.MYSQL_USER || "oGZSQM4dBE",
    password: process.env.MYSQL_PASS || "0m6TQoEFzG",
    database: process.env.MYSQL_DB || "oGZSQM4dBE", 
  },
};

// --host=0.0.0.0 --disable-host-check

