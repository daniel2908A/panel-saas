const mysql = require('mysql2/promise');

console.log("🔥 MYSQLHOST:", process.env.MYSQLHOST);
console.log("🔥 MYSQLUSER:", process.env.MYSQLUSER);
console.log("🔥 MYSQLDATABASE:", process.env.MYSQLDATABASE);

const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
});

module.exports = db;