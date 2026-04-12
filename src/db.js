throw new Error("🔥 ESTE DB.JS SE ESTA USANDO 🔥");
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,

  waitForConnections: true,
  connectionLimit: 10,
});
console.log("🔥 USANDO DB CORRECTA:", process.env.MYSQLHOST);
console.log("🚀 VERSION NUEVA DB ACTIVADA");
module.exports = db;