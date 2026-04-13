const mysql = require('mysql2/promise');

// 🔹 Crear pool de conexión
const db = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,      // máximo conexiones simultáneas
  queueLimit: 0,            // ilimitado en cola
  ssl: {
    rejectUnauthorized: false  // necesario para Railway
  }
});

// 🔹 Test de conexión
(async () => {
  try {
    const conn = await db.getConnection();
    console.log("✅ Conexión a DB establecida correctamente");
    conn.release();
  } catch (err) {
    console.error("❌ Error conectando a DB:", err.message);
    process.exit(1);
  }
})();

module.exports = db;