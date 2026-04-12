const db = require('../db');

// 🔹 CREAR PRODUCTO
exports.createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Nombre y precio son obligatorios' });
    }

    const [result] = await db.query(
      'INSERT INTO products (name, price) VALUES (?, ?)',
      [name, price]
    );

    res.json({
      message: 'Producto creado correctamente',
      productId: result.insertId
    });

  } catch (error) {
    console.error('Error createProduct:', error);
    res.status(500).json({ error: 'Error creando producto' });
  }
};


// 🔹 OBTENER TODOS LOS PRODUCTOS (🔥 SIMPLE Y FUNCIONAL)
exports.getProducts = async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products');

    // 🔥 SIEMPRE DEVOLVER ARRAY
    res.json(products);

  } catch (error) {
    console.error('Error getProducts:', error);
    res.status(500).json({ error: 'Error obteniendo productos' });
  }
};


// 🔓 PRODUCTOS PÚBLICOS
exports.getProductsPublic = async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products');
    res.json(products);
  } catch (error) {
    console.error('Error getProductsPublic:', error);
    res.status(500).json({ error: 'Error obteniendo productos públicos' });
  }
};


// 🔹 OBTENER UNO
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(products[0]);

  } catch (error) {
    console.error('Error getProductById:', error);
    res.status(500).json({ error: 'Error obteniendo producto' });
  }
};


// 🔹 ACTUALIZAR PRODUCTO
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    await db.query(
      'UPDATE products SET name = ?, price = ? WHERE id = ?',
      [name, price, id]
    );

    res.json({ message: 'Producto actualizado correctamente' });

  } catch (error) {
    console.error('Error updateProduct:', error);
    res.status(500).json({ error: 'Error actualizando producto' });
  }
};


// 🔹 ELIMINAR PRODUCTO
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      'DELETE FROM products WHERE id = ?',
      [id]
    );

    res.json({ message: 'Producto eliminado correctamente' });

  } catch (error) {
    console.error('Error deleteProduct:', error);
    res.status(500).json({ error: 'Error eliminando producto' });
  }
};