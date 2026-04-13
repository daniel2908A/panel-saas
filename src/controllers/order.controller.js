const db = require('../db');
const commissionService = require('../services/commission.service');

// =======================
// COMPRA PRODUCTO
// =======================
exports.buyProduct = async (req, res) => {
  let conn;

  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const { productId, quantity } = req.body;

    const qty = parseInt(quantity);

    if (!productId || !qty || qty <= 0) {
      return res.status(400).json({ message: 'Datos inválidos' });
    }

    conn = await db.getConnection();
    await conn.beginTransaction();

    // PRODUCTO
    const [products] = await conn.query(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    );

    if (!products.length) {
      throw new Error('Producto no encontrado');
    }

    const product = products[0];
    const total = product.price * qty;

    // USUARIO
    const [users] = await conn.query(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    if (!users.length) {
      throw new Error('Usuario no encontrado');
    }

    const user = users[0];

    if (user.credits < total) {
      throw new Error('Saldo insuficiente');
    }

    // STOCK
    const [accounts] = await conn.query(
      'SELECT * FROM accounts WHERE product_id = ? AND status = "available" LIMIT ?',
      [productId, qty]
    );

    if (accounts.length < qty) {
      throw new Error('Stock insuficiente');
    }

    // DESCONTAR SALDO
    await conn.query(
      'UPDATE users SET credits = credits - ? WHERE id = ?',
      [total, userId]
    );

    // CREAR ORDEN
    const [orderResult] = await conn.query(
      'INSERT INTO orders (user_id, product_id, quantity, total) VALUES (?, ?, ?, ?)',
      [userId, productId, qty, total]
    );

    const orderId = orderResult.insertId;

    // ENTREGA
    for (let acc of accounts) {
      await conn.query(
        'UPDATE accounts SET status = "sold", order_id = ? WHERE id = ?',
        [orderId, acc.id]
      );
    }

    // COMISIONES MULTINIVEL
    await commissionService.processCommissions(conn, userId, total);

    // COMISIÓN DIRECTA
    const [buyer] = await conn.query(
      "SELECT parent_id FROM users WHERE id = ?",
      [userId]
    );

    if (buyer.length && buyer[0].parent_id) {
      const commission = total * 0.10;

      await conn.query(
        "UPDATE users SET credits = credits + ? WHERE id = ?",
        [commission, buyer[0].parent_id]
      );

      await conn.query(
        "INSERT INTO commissions (user_id, from_user, amount) VALUES (?, ?, ?)",
        [buyer[0].parent_id, userId, commission]
      );
    }

    await conn.commit();

    res.json({
      message: 'Compra exitosa',
      orderId,
      accounts: accounts.map(acc => ({
        email: acc.email,
        password: acc.password
      }))
    });

  } catch (error) {
    if (conn) await conn.rollback();

    console.error("ERROR BUY PRODUCT:", error);

    res.status(500).json({
      message: error.message || "Error en compra"
    });

  } finally {
    if (conn) conn.release();
  }
};

// =======================
// MIS ÓRDENES
// =======================
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const [orders] = await db.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC',
      [userId]
    );

    res.json(orders);

  } catch (error) {
    console.error("ERROR GET ORDERS:", error);

    res.status(500).json({
      message: "Error obteniendo órdenes"
    });
  }
};