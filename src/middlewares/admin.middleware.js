module.exports = (req, res, next) => {
  try {
    // 🔎 verificar usuario
    if (!req.user) {
      return res.status(401).json({ error: "No autorizado" });
    }

    // 🔥 validar rol admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Acceso solo para admin" });
    }

    next();

  } catch (error) {
    console.error("Error en admin.middleware:", error);
    res.status(500).json({ error: "Error interno" });
  }
};