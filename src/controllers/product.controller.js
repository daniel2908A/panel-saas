const db = require('../db');

// 🔹 CREAR PRODUCTO (CON DEBUG REAL)
exports.createProduct = async (req, res) => {
  try {

    // 🔥 VER EXACTAMENTE QUÉ LLEGA
    console.log("USER COMPLETO:", req.user);

    const role = req.user?.role;

    // 🔥 VALIDACIÓN REAL
    if (role !== 'admin' && role !== 'super_reseller') {
      return res.status(403).json({
        error: "Acceso denegado",
        roleDetectado: role || "NO DEFINIDO"
      });
    }

    const { name, price, description, image } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Nombre y precio obligatorios' });
    }

    await db.query(
      `INSERT INTO products (name, price, description, image, user_id)
       VALUES (?, ?, ?, ?, ?)`,
      [
        name,
        price,
        description || '',
        image || '',
        req.user.id
      ]
    );

    res.json({ message: 'Producto creado correctamente' });

  } catch (error) {
    console.error('ERROR REAL createProduct:', error);
    res.status(500).json({ error: 'Error creando producto' });
  }
};


// 🔹 OBTENER PRODUCTOS
exports.getProducts = async (req, res) => {
  try {
    const [products] = await db.query(`
      SELECT p.*, u.username
      FROM products p
      LEFT JOIN users u ON p.user_id = u.id
      ORDER BY p.id DESC
    `);

    res.json(products);

  } catch (error) {
    console.error('ERROR REAL getProducts:', error);
    res.status(500).json({ error: 'Error obteniendo productos' });
  }
};


// 🔓 PÚBLICOS
exports.getProductsPublic = async (req, res) => {
  try {
    const [products] = await db.query(`
      SELECT p.*, u.username
      FROM products p
      LEFT JOIN users u ON p.user_id = u.id
    `);

    res.json(products);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error productos públicos' });
  }
};


// 🔹 UNO
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await db.query(`
      SELECT p.*, u.username
      FROM products p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [id]);

    if (!products.length) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(products[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo producto' });
  }
};


// 🔹 ACTUALIZAR
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, image } = req.body;

    await db.query(
      `UPDATE products 
       SET name = ?, price = ?, description = ?, image = ?
       WHERE id = ?`,
      [name, price, description, image, id]
    );

    res.json({ message: 'Producto actualizado' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error actualizando' });
  }
};


// 🔹 ELIMINAR
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      'DELETE FROM products WHERE id = ?',
      [id]
    );

    res.json({ message: 'Producto eliminado' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error eliminando' });
  }
};