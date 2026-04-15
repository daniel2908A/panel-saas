const db = require('../db');

// =======================
// LISTAR USUARIOS
// =======================
const getUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, email, role, credits, is_active FROM users"
    );

    res.json(users);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error cargando usuarios" });
  }
};

module.exports = { getUsers };