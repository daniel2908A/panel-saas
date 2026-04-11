module.exports = function requireRole(...rolesPermitidos) {
  return (req, res, next) => {
    try {
      const user = req.user;

      // 🔒 validar login
      if (!user) {
        return res.status(401).json({ error: "No autorizado" });
      }

      // 🔥 admin SIEMPRE puede todo
      if (user.role === 'admin') {
        return next();
      }

      // 🔎 validar rol permitido
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