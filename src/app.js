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

// 🔥 CAMBIO CLAVE AQUÍ
app.use('/api', authRoutes); // ← IMPORTANTE

app.use('/api/user', userRoutes);
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

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Test
app.get('/api', (req, res) => {
  res.json({ message: "API funcionando 🚀" });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Error global
app.use((err, req, res, next) => {
  console.error("Error global:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});