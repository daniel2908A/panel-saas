module.exports = function requireRole(rolesPermitidos = [], options = {}) {
  return (req, res, next) => {
    try {
      const user = req.user;

      // 🔒 validar login
      if (!user) {
        return res.status(401).json({ error: "No autorizado" });
      }

      const { allowAdmin = true } = options;

      // 🔥 admin puede todo
      if (allowAdmin && user.role === 'admin') {
        return next();
      }

      // 🧠 NORMALIZAR (acepta string o array)
      let roles = rolesPermitidos;

      if (!Array.isArray(rolesPermitidos)) {
        roles = [rolesPermitidos];
      }

      // ❌ validar rol
      if (!roles.includes(user.role)) {
        return res.status(403).json({ error: "Acceso denegado" });
      }

      next();

    } catch (error) {
      console.error("Error en role.middleware:", error);
      res.status(500).json({ error: "Error interno" });
    }
  };
};