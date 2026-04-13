const db = require('../db');
const multer = require('multer');
const path = require('path');

// =======================
// MULTER CONFIG
// =======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// =======================
// CREAR PRODUCTO
// =======================
const createProduct = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const { name, price, description } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const image = req.file ? req.file.filename : null;

    await db.query(
      'INSERT INTO products (name, price, description, image, user_id) VALUES (?, ?, ?, ?, ?)',
      [name, price, description || "", image, userId]
    );

    res.json({ message: "Producto creado" });

  } catch (err) {
    console.error("ERROR CREATE PRODUCT:", err);
    res.status(500).json({ error: "Error creando producto" });
  }
};

// =======================
// LISTAR PRODUCTOS
// =======================
const getProducts = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const [rows] = await db.query(
      'SELECT * FROM products WHERE user_id = ?',
      [userId]
    );

    res.json(rows);

  } catch (err) {
    console.error("ERROR GET PRODUCTS:", err);
    res.status(500).json({ error: "Error obteniendo productos" });
  }
};

// =======================
// ACTUALIZAR PRODUCTO
// =======================
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;

    let query = 'UPDATE products SET name=?, price=?, description=?';
    let params = [name, price, description || ""];

    if (req.file) {
      query += ', image=?';
      params.push(req.file.filename);
    }

    params.push(id);

    await db.query(query + ' WHERE id=?', params);

    res.json({ message: "Producto actualizado" });

  } catch (err) {
    console.error("ERROR UPDATE PRODUCT:", err);
    res.status(500).json({ error: "Error actualizando producto" });
  }
};

// =======================
// ELIMINAR PRODUCTO
// =======================
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query('DELETE FROM products WHERE id=?', [id]);

    res.json({ message: "Producto eliminado" });

  } catch (err) {
    console.error("ERROR DELETE PRODUCT:", err);
    res.status(500).json({ error: "Error eliminando producto" });
  }
};

// =======================
// EXPORT CORRECTO
// =======================
module.exports = {
  upload,
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct
};