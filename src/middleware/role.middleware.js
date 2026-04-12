module.exports = function requireRole(rolesPermitidos = [], options = {}) {
  return (req, res, next) => {
    try {
      const user = req.user;

      // 🔒 validar login
      if (!user) {
        return res.status(401).json({ error: "No autorizado" });
      }

      const { allowAdmin = true } = options;

      // 🔥 admin puede todo (si está permitido)
      if (allowAdmin && user.role === 'admin') {
        return next();
      }

      // ❌ validar rol permitido
      if (!rolesPermitidos.includes(user.role)) {
        return res.status(403).json({ error: "Acceso denegado" });
      }

      next();

    } catch (error) {
      console.error("Error en role.middleware:", error);
      res.status(500).json({ error: "Error interno" });
    }
  };
};