require('dotenv').config();
console.log("Deploy corregido");

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

// Rutas
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const adminRoutes = require('./routes/admin.routes');
const depositRoutes = require('./routes/deposits.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const resellerRoutes = require('./routes/reseller.routes');
const commissionRoutes = require('./routes/commission.routes');
const planRoutes = require('./routes/plan.routes');
const webhookRoutes = require('./routes/webhook.routes');

// =====================
// ROUTES
// =====================
app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/commissions', commissionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/deposits', depositRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reseller', resellerRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/plan', planRoutes);
app.use('/api/webhook', webhookRoutes);

// =============================
// 🔥 PRODUCTOS PÚBLICOS (FIXED)
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

    // 🔥 COMPATIBLE CON TODAS LAS CONFIGS
    const products = Array.isArray(result) ? result[0] : result;

    res.json(products);

  } catch (err) {
    console.error("Error productos públicos:", err);
    res.status(500).json({ error: "Error cargando productos" });
  }
});

// =====================
// RUTA PRINCIPAL
// =====================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

// =====================
// TEST API
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