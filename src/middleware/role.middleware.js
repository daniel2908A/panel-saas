module.exports = (...roles) => {
  return (req, res, next) => {
    try {

      if (!req.user) {
        return res.status(401).json({ error: "No autorizado" });
      }

      const userRole = req.user.role;

      console.log("ROL ACTUAL:", userRole);
      console.log("ROLES PERMITIDOS:", roles);

      // 🔥 ADMIN SIEMPRE PASA
      if (userRole === 'admin') {
        return next();
      }

      // 🔥 VALIDACIÓN FLEXIBLE
      if (!roles.includes(userRole)) {
        return res.status(403).json({
          error: "Acceso denegado",
          debug: {
            userRole,
            rolesPermitidos: roles
          }
        });
      }

      next();

    } catch (err) {
      console.error("ROLE ERROR:", err);
      res.status(500).json({ error: "Error interno" });
    }
  };
};