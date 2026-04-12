require('dotenv').config();

console.log("nuevo deploy limpio sin bcrypt");

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// 🔥 IMPORTANTE: DB
const db = require('./db'); // 👈 ASEGÚRATE QUE ESTA RUTA ES CORRECTA

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
const resellerRoutes = require('./routes/reseller.routes');
const commissionRoutes = require('./routes/commission.routes');

// 🔥 NUEVO: PLANES
const planRoutes = require('./routes/plan.routes');

// 🔥 NUEVO: WEBHOOK BINANCE
const webhookRoutes = require('./routes/webhook.routes');

// 🔥 IMPORTAR PROCESADOR
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

// 🔥 PLANES
app.use('/api/plan', planRoutes);

// 🔥 WEBHOOK
app.use('/api/webhook', webhookRoutes);

// =======================================
// 🔥🔥🔥 FIX BASE DE DATOS (TEMPORAL)
// =======================================
app.get('/fix-db', async (req, res) => {
  try {

    // 1. quitar AUTO_INCREMENT primero (si existe mal)
    await db.query(`
      ALTER TABLE users MODIFY id INT
    `);

    // 2. eliminar primary key si existe (evita conflicto)
    try {
      await db.query(`ALTER TABLE users DROP PRIMARY KEY`);
    } catch (e) {
      console.log("No tenía PK, seguimos...");
    }

    // 3. ahora sí dejarlo correcto
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

// 🔁 CRON AUTOMÁTICO
setInterval(() => {
  console.log("🔄 Revisando depósitos...");
  processDeposits();
}, 60000);

// 🚫 404 HANDLER
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// 🚨 ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("Error global:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

// 🚀 SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});