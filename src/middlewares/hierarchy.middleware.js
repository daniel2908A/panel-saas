module.exports = function allowRoles(...rolesPermitidos) {
  return (req, res, next) => {
    try {
      const user = req.user;

      // 🔒 validar login
      if (!user) {
        return res.status(401).json({ error: "No autorizado" });
      }

      // 🔎 validar rol
      if (!rolesPermitidos.includes(user.role)) {
        return res.status(403).json({ error: "No tienes permisos" });
      }

      next();

    } catch (error) {
      console.error("Error en hierarchy.middleware:", error);
      res.status(500).json({ error: "Error interno" });
    }
  };
};