module.exports = {
  api: {
    // host: process.env.API_HOST || "http://localhost",
    // port: process.env.API_PORT || 3000,
    // name: process.env.API_NAME || "api"
    host: process.env.API_HOST,
    port: process.env.API_PORT,
    name: process.env.API_NAME
  },

  mysql: {
    // host: process.env.MYSQL_HOST || "127.0.0.1",
    // // host: process.env.MYSQL_HOST || "192.168.0.27",
    // user: process.env.MYSQL_USER || "root",
    // password: process.env.MYSQL_PASS || "toor",
    // database: process.env.MYSQL_DB || "chat",
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
  },

  // mysql: {
  //   host: process.env.MYSQL_HOST || "sql10.freemysqlhosting.net",
  //   user: process.env.MYSQL_USER || "sql10439814",
  //   password: process.env.MYSQL_PASS || "vB8SKAdsEm",
  //   database: process.env.MYSQL_DB || "sql10439814",
  // },
};


