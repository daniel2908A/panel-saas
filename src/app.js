// src/app.js
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const depositRoutes = require("./routes/deposits.routes");
const { authMiddleware } = require("./middleware/auth.middleware");
const { adminMiddleware } = require("./middleware/admin.middleware");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "../public")));

// Redirigir raíz a login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

// Rutas de autenticación
app.use("/api/auth", authRoutes);

// Rutas protegidas por login
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/dashboard", authMiddleware, dashboardRoutes);
app.use("/api/deposit", authMiddleware, depositRoutes);

// Redirección según rol (ejemplo login)
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  // Aquí debería ir tu función real de login que devuelve usuario y token
  const user = await loginUser(email, password); // <- tu función de login
  if (!user) return res.status(401).json({ message: "Usuario o contraseña inválidos" });

  const token = generateToken(user); // <- tu función de JWT
  res.json({
    message: "Login exitoso",
    token,
    role: user.role,
    user: {
      id: user.id,
      role: user.role,
      status: user.status || "active",
    },
    redirect: user.role === "owner" ? "/admin.html" : "/dashboard.html",
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).send("Página no encontrada");
});

// Start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});