require('dotenv').config();
console.log("Deploy debug iniciado");

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// DB
const db = require('./db');

// Middlewares
app.use(cors());
app.use(express.json());

// Frontend
app.use(express.static(path.join(__dirname, '../public')));

// =====================
// IMPORT ROUTES + DEBUG
// =====================
function safeRoute(pathName, route) {
  console.log(`Route ${pathName}:`, typeof route);

  if (typeof route !== "function") {
    console.error(`❌ ERROR EN ROUTE: ${pathName} NO es válido`);
    return;
  }

  app.use(pathName, route);
}

// =====================
// ROUTES
// =====================
safeRoute('/api', require('./routes/auth.routes'));
safeRoute('/api/users', require('./routes/user.routes'));
safeRoute('/api/products', require('./routes/product.routes'));
safeRoute('/api/orders', require('./routes/order.routes'));
safeRoute('/api/commissions', require('./routes/commission.routes'));
safeRoute('/api/admin', require('./routes/admin.routes'));
safeRoute('/api/deposits', require('./routes/deposits.routes'));
safeRoute('/api/dashboard', require('./routes/dashboard.routes'));
safeRoute('/api/reseller', require('./routes/reseller.routes'));
safeRoute('/api/plan', require('./routes/plan.routes'));
safeRoute('/api/webhook', require('./routes/webhook.routes'));

app.use('/uploads', express.static('uploads'));

// =============================
// 🔥 PRODUCTOS PÚBLICOS
// =============================
app.get('/api/products/public', async (req, res) => {
  try {

    const result = await db.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.color,
        p.category,
        u.username as seller
      FROM products p
      LEFT JOIN users u ON p.user_id = u.id
    `);

    const products = Array.isArray(result) ? result[0] : result;

    res.json(products);

  } catch (err) {
    console.error("Error productos públicos:", err);
    res.status(500).json({ error: "Error cargando productos" });
  }
});

// =====================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.get('/api', (req, res) => {
  res.json({ message: "API funcionando 🚀" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  console.error("Error global:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});