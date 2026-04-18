const db = require('../db');

// =============================
// 💸 COMPRA REAL + ACTIVACIÓN + GANANCIA
// =============================
const buyProduct = async (req, res) => {
  try {

    const userId = req.user.id;
    const { productId } = req.body;

    // usuario
    const [[user]] = await db.query(
      "SELECT * FROM users WHERE id = ?", [userId]
    );

    // producto
    const [[product]] = await db.query(
      "SELECT * FROM products WHERE id = ?", [productId]
    );

    if (!product) {
      return res.status(404).json({ error: "Producto no existe" });
    }

    if (user.credits < product.price) {
      return res.status(400).json({ error: "Créditos insuficientes" });
    }

    // expiración 30 días
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);

    await db.query("START TRANSACTION");

    // descontar créditos
    await db.query(
      "UPDATE users SET credits = credits - ? WHERE id = ?",
      [product.price, userId]
    );

    // guardar compra
    await db.query(`
      INSERT INTO purchases (user_id, product_id, expires_at)
      VALUES (?, ?, ?)
    `, [userId, productId, expires]);

    // 💰 GANANCIA AL VENDEDOR
    if (product.user_id) {
      const commission = product.price * 0.2;

      await db.query(`
        UPDATE users 
        SET earnings_sales = IFNULL(earnings_sales,0) + ?
        WHERE id = ?
      `, [commission, product.user_id]);
    }

    await db.query("COMMIT");

    res.json({ success: true });

  } catch (err) {
    await db.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Error en compra" });
  }
};

// =============================
// 📦 MIS PRODUCTOS
// =============================
const getMyOrders = async (req, res) => {
  try {

    const userId = req.user.id;

    const [rows] = await db.query(`
      SELECT 
        p.name,
        p.description,
        pu.expires_at
      FROM purchases pu
      JOIN products p ON pu.product_id = p.id
      WHERE pu.user_id = ?
      ORDER BY pu.created_at DESC
    `, [userId]);

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error cargando productos" });
  }
};

module.exports = {
  buyProduct,
  getMyOrders
};