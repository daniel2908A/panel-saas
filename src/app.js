const express = require('express');
const app = express();
const cors = require('cors');

// Middlewares
const authMiddleware = require('./middlewares/auth.middleware');
const adminMiddleware = require('./middlewares/admin.middleware');

// Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const resellerRoutes = require('./routes/reseller.routes');
const adminRoutes = require('./routes/admin.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const depositRoutes = require('./routes/deposit.routes');
const commissionRoutes = require('./routes/commission.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const planRoutes = require('./routes/plan.routes');
const webhookRoutes = require('./routes/webhook.routes');
const usersRoutes = require('./routes/users.routes'); // para Owner Panel

// Configuración global
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', resellerRoutes);
app.use('/api', adminRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', depositRoutes);
app.use('/api', commissionRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', planRoutes);
app.use('/api', webhookRoutes);
app.use('/api', usersRoutes); // Owner Panel

// Error handler general
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Error del servidor" });
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Nexora corriendo en puerto ${PORT}`);
});