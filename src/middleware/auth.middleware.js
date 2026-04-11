const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // 🔎 obtener header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Token requerido" });
    }

    // 🔥 formato: Bearer TOKEN
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: "Token inválido" });
    }

    // 🔐 verificar token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secretkey"
    );

    // 🔥 guardar usuario en request
    req.user = decoded;

    next();

  } catch (error) {
    console.error("Auth error:", error);

    return res.status(401).json({
      error: "Token inválido o expirado"
    });
  }
};