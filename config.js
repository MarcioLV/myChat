module.exports = {
  api: {
    host: process.env.API_HOST || "http://localhost",
    port: process.env.API_PORT || 3000,
    name: process.env.API_NAME || "api"
  },

  mysql: {
    host: process.env.MYSQL_HOST || "127.0.0.1",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASS || "toor",
    database: process.env.MYSQL_DB || "chat",
  },

  // mysql: {
  //   host: process.env.MYSQL_HOST || "sql10.freemysqlhosting.net",
  //   user: process.env.MYSQL_USER || "sql10439814",
  //   password: process.env.MYSQL_PASS || "vB8SKAdsEm",
  //   database: process.env.MYSQL_DB || "sql10439814",
  // },
};


