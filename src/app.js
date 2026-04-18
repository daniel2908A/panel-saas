require('dotenv').config();
console.log("Deploy estable iniciado");

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
// 🔥 PRODUCTOS PÚBLICOS (ULTRA FIX)
// =============================
app.get('/api/products/public', async (req, res) => {
  try {

    console.log("📡 Intentando cargar productos públicos...");

    const result = await db.query("SELECT * FROM products");

    let products = [];

    // 🔥 compatibilidad mysql / mysql2
    if (Array.isArray(result)) {
      products = result[0];
    } else {
      products = result;
    }

    // 🔥 FORZAR ARRAY SI O SI
    if (!Array.isArray(products)) {
      console.log("⚠️ Resultado no es array:", products);
      products = [];
    }

    console.log("✅ Productos enviados:", products.length);

    res.json(products);

  } catch (err) {
    console.error("🔥 ERROR PUBLIC PRODUCTS:", err);

    // 🔥 NUNCA ROMPER FRONTEND
    res.json([]);
  }
});

// =====================
// ROOT
// =====================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

// =====================
app.get('/api', (req, res) => {
  res.json({ message: "API funcionando 🚀" });
});

// =====================
// 404
// =====================
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// =====================
// ERROR GLOBAL
// =====================
app.use((err, req, res, next) => {
  console.error("Error global:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

// =====================
// SERVER
// =====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});