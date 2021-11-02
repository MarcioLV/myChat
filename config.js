module.exports = {
  api: {
    host: process.env.HOST,
    port: process.env.PORT,
    name: process.env.NAME
  },

  mysql: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
  },
};

// --host=0.0.0.0 --disable-host-check

