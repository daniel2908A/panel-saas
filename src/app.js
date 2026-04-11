require('dotenv').config();

console.log("nuevo deploy limpio sin bcrypt");

const commissionRoutes = require('./routes/commission.routes');
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// 🔥 MIDDLEWARES
app.use(cors());
app.use(express.json());

// 🔥 SERVIR FRONTEND
app.use(express.static(path.join(__dirname, '../public')));

// 🔥 IMPORTAR RUTAS
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const adminRoutes = require('./routes/admin.routes');
const depositRoutes = require('./routes/deposits.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const resellerRoutes = require('./routes/reseller.routes'); // 👈 NUEVO

// 🔥 IMPORTAR PROCESADOR AUTOMÁTICO 👇
const processDeposits = require('./utils/depositProcessor');

// 🔗 USAR RUTAS
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/commissions', commissionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/deposits', depositRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reseller', resellerRoutes); // 👈 NUEVO

// 🔥 RUTA TEST
app.get('/api', (req, res) => {
  res.json({ message: "API funcionando 🚀" });
});

// 🔁 CRON AUTOMÁTICO (CADA 60 SEGUNDOS)
setInterval(() => {
  console.log("🔄 Revisando depósitos...");
  processDeposits();
}, 60000);

// 🚫 404 HANDLER
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// 🚨 ERROR HANDLER GLOBAL
app.use((err, req, res, next) => {
  console.error("Error global:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

// 🚀 SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});