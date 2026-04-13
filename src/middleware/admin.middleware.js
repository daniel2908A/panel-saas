module.exports = (req, res, next) => {
  try {
    // =======================
    // VALIDAR USUARIO
    // =======================
    if (!req.user || !req.user.role) {
      return res.status(401).json({ error: "No autorizado" });
    }

    // =======================
    // VALIDAR ADMIN
    // =======================
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Acceso solo para admin" });
    }

    next();

  } catch (error) {
    console.error("ERROR ADMIN MIDDLEWARE:", error);

    return res.status(500).json({
      error: "Error interno del servidor"
    });
  }
};