const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Token requerido" });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 IMPORTANTE: guardar TODO
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    console.log("USER DESDE TOKEN:", req.user); // 👈 DEBUG

    next();

  } catch (error) {
    console.error("AUTH ERROR:", error);
    res.status(401).json({ error: "Token inválido" });
  }
};