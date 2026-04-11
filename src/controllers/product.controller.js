const db = require('../config/db');

// 🔹 CREAR PRODUCTO
exports.createProduct = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    const [result] = await db.query(
      'INSERT INTO products (name) VALUES (?)',
      [name]
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


// 🔹 OBTENER TODOS LOS PRODUCTOS + PLANES (PRIVADO)
exports.getProducts = async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products');
    const [plans] = await db.query('SELECT * FROM plans');

    const productsWithPlans = products.map(product => {
      const productPlans = plans.filter(plan => plan.product_id === product.id);

      return {
        id: product.id,
        name: product.name,
        plans: productPlans
      };
    });

    res.json(productsWithPlans);

  } catch (error) {
    console.error('Error getProducts:', error);
    res.status(500).json({ error: 'Error obteniendo productos' });
  }
};


// 🔓 🔥 PRODUCTOS PÚBLICOS (SIN LOGIN)
exports.getProductsPublic = async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products');
    const [plans] = await db.query('SELECT * FROM plans');

    const productsWithPlans = products.map(product => {
      const productPlans = plans.filter(plan => plan.product_id === product.id);

      return {
        id: product.id,
        name: product.name,
        plans: productPlans
      };
    });

    res.json(productsWithPlans);

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

    const [plans] = await db.query(
      'SELECT * FROM plans WHERE product_id = ?',
      [id]
    );

    res.json({
      ...products[0],
      plans
    });

  } catch (error) {
    console.error('Error getProductById:', error);
    res.status(500).json({ error: 'Error obteniendo producto' });
  }
};


// 🔹 ACTUALIZAR PRODUCTO
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    await db.query(
      'UPDATE products SET name = ? WHERE id = ?',
      [name, id]
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