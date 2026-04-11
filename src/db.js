const mysql = require('mysql2/promise');
require('dotenv').config();

// 🔥 CREAR POOL DE CONEXIONES
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'panel',

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 🔥 TEST DE CONEXIÓN
(async () => {
  try {
    const conn = await db.getConnection();
    console.log("✅ DB conectada correctamente");
    conn.release();
  } catch (error) {
    console.error("❌ Error conectando DB:", error);
  }
})();

// 🔥 HELPER PARA QUERIES (PRO)
db.executeQuery = async (query, params = []) => {
  try {
    const [rows] = await db.query(query, params);
    return rows;
  } catch (error) {
    console.error("❌ Error en query:", error);
    throw error;
  }
};

module.exports = db;