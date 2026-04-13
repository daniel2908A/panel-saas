const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) return res.status(401).json({ error: "Token requerido" });

    const token = header.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token inválido" });

    const secret = process.env.JWT_SECRET || "secretkey";
    const decoded = jwt.verify(token, secret);

    req.user = decoded;
    next();
  } catch (err) {
    console.error("ERROR AUTH:", err.message);
    return res.status(403).json({ error: "Token inválido o expirado" });
  }
};