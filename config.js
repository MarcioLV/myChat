module.exports = {
  api: {
    host: process.env.HOST || "http://192.168.0.28",
    port: process.env.PORT || "3000",
    name: process.env.NAME || "api"
  },

  mysql: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
  },
};

// --host=0.0.0.0 --disable-host-check

