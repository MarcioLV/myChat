module.exports = {
  api: {
    host: process.env.HOST,
    // host: process.env.HOST || "http://localhost:3000",
    // port: process.env.PORT,
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
//  host: process.env.MYSQL_HOST || "remotemysql.com",
//     user: process.env.MYSQL_USER || "oGZSQM4dBE",
//     password: process.env.MYSQL_PASS || "0m6TQoEFzG",
//     database: process.env.MYSQL_DB || "oGZSQM4dBE", 

