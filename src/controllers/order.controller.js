const db = require('../config/db');
const commissionService = require('../services/commission.service');

// 🛒 COMPRA CON ENTREGA + COMISIONES
exports.buyProduct = async (req, res) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      throw new Error('Datos incompletos');
    }

    // 🔹 1. Obtener producto
    const [products] = await conn.query(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    );

    if (products.length === 0) {
      throw new Error('Producto no encontrado');
    }

    const product = products[0];
    const total = product.price * quantity;

    // 🔹 2. Obtener usuario
    const [users] = await conn.query(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      throw new Error('Usuario no encontrado');
    }

    const user = users[0];

    if (user.credits < total) {
      throw new Error('Saldo insuficiente');
    }

    // 🔹 3. Ver stock disponible
    const [accounts] = await conn.query(
      'SELECT * FROM accounts WHERE product_id = ? AND status = "available" LIMIT ?',
      [productId, quantity]
    );

    if (accounts.length < quantity) {
      throw new Error('Stock insuficiente');
    }

    // 🔹 4. Descontar saldo
    await conn.query(
      'UPDATE users SET credits = credits - ? WHERE id = ?',
      [total, userId]
    );

    // 🔹 5. Crear orden
    const [orderResult] = await conn.query(
      'INSERT INTO orders (user_id, product_id, quantity, total) VALUES (?, ?, ?, ?)',
      [userId, productId, quantity, total]
    );

    const orderId = orderResult.insertId;

    // 🔥 6. ENTREGA AUTOMÁTICA
    for (let acc of accounts) {
      await conn.query(
        'UPDATE accounts SET status = "sold", order_id = ? WHERE id = ?',
        [orderId, acc.id]
      );
    }

    // 💰 7. COMISIONES MULTINIVEL (YA TENÍAS)
    await commissionService.processCommissions(conn, userId, total);

    // 🔥 8. COMISIÓN DIRECTA PARA SUPER RESELLER
    const [buyer] = await conn.query(
      "SELECT parent_id FROM users WHERE id = ?",
      [userId]
    );

    if (buyer[0].parent_id) {

      const commissionPercent = 10; // puedes ajustar
      const commission = total * (commissionPercent / 100);

      await conn.query(
        "UPDATE users SET credits = credits + ? WHERE id = ?",
        [commission, buyer[0].parent_id]
      );

      // guardar registro
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
    await conn.rollback();
    console.error(error);
    res.status(400).json({ message: error.message });
  } finally {
    conn.release();
  }
};


// 📦 MIS ORDENES
exports.getMyOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC',
      [req.user.id]
    );

    res.json(orders);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};