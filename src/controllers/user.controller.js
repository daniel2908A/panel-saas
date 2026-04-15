const db = require('../db');

// =======================
// LISTAR USUARIOS (FIX)
// =======================
const getUsers = async (req, res) => {
  try {

    const [users] = await db.query("SELECT * FROM users");

    res.json(users);

  } catch (err) {
    console.error("ERROR REAL:", err); // 🔥 esto nos dirá si algo falla
    res.status(500).json({ error: "Error cargando usuarios" });
  }
};

module.exports = { getUsers };