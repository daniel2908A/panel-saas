// app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const depositRoutes = require('./routes/deposit.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

// Middlewares
const authMiddleware = require('./middleware/auth.middleware');
const adminMiddleware = require('./middleware/admin.middleware');

const app = express();

// Middlewares generales
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // servir archivos estáticos (html, js, css)

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, adminMiddleware, userRoutes); // solo admin puede acceder
app.use('/api/deposit', authMiddleware, depositRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

// Redirección de raíz
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Ruta 404
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});