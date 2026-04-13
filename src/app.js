require('dotenv').config();
console.log("Nuevo deploy limpio sin bcrypt");

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// 🔥 BASE DE DATOS
const db = require('./db');

// 🔥 MIDDLEWARES
app.use(cors());
app.use(express.json());

// 🔥 SERVIR FRONTEND
app.use(express.static(path.join(__dirname, '../public')));

// 🔥 IMPORTAR RUTAS
// 🔗 USAR RUTAS
app.use('/api', authRoutes); // <-- CORREGIDO PARA QUE /api/login FUNCIONE
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

// 🔥 IMPORTAR PROCESADOR DE DEPÓSITOS
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
app.use('/api/reseller', resellerRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/plan', planRoutes);
app.use('/api/webhook', webhookRoutes);

// =======================================
// 🔥🔥🔥 FIX BASE DE DATOS TEMPORAL
// =======================================
app.get('/fix-db', async (req, res) => {
  try {
    await db.query(`ALTER TABLE users MODIFY id INT`);

    try {
      await db.query(`ALTER TABLE users DROP PRIMARY KEY`);
    } catch (e) {
      console.log("No tenía PK, seguimos...");
    }

    await db.query(`
      ALTER TABLE users 
      MODIFY id INT NOT NULL AUTO_INCREMENT,
      ADD PRIMARY KEY (id)
    `);

    res.send("✅ DB ARREGLADA CORRECTAMENTE");

  } catch (err) {
    console.error(err);
    res.send("❌ ERROR: " + err.message);
  }
});
// =======================================

// 🔥 RUTA PRINCIPAL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/register.html'));
});

// 🔥 TEST API
app.get('/api', (req, res) => {
  res.json({ message: "API funcionando 🚀" });
});

// 🔁 CRON AUTOMÁTICO: revisar depósitos cada 60s
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