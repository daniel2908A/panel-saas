const db = require('../db');
const multer = require('multer');
const path = require('path');

// CONFIG MULTER
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });
exports.upload = upload;

// CREAR PRODUCTO
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const image = req.file ? '/uploads/' + req.file.filename : null;

    await db.query(
      'INSERT INTO products (name, price, description, image, user_id) VALUES (?, ?, ?, ?, ?)',
      [name, price, description, image, req.user.id]
    );

    res.json({ message: "Producto creado" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error creando producto" });
  }
};

// LISTAR PRODUCTOS
exports.getProducts = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM products WHERE user_id = ?',
      [req.user.id]
    );

    res.json(rows);

  } catch (err) {
    res.status(500).json({ error: "Error obteniendo productos" });
  }
};

// ACTUALIZAR
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;

    let query = 'UPDATE products SET name=?, price=?, description=?';
    let params = [name, price, description];

    if (req.file) {
      query += ', image=?';
      params.push('/uploads/' + req.file.filename);
    }

    params.push(id);

    await db.query(query + ' WHERE id=?', params);

    res.json({ message: "Producto actualizado" });

  } catch (err) {
    res.status(500).json({ error: "Error actualizando producto" });
  }
};

// ELIMINAR
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query('DELETE FROM products WHERE id=?', [id]);

    res.json({ message: "Producto eliminado" });

  } catch (err) {
    res.status(500).json({ error: "Error eliminando producto" });
  }
};