module.exports = (...roles) => {
  return (req, res, next) => {
    try {

      const user = req.user;

      if (!user) {
        return res.status(401).json({ error: "No autorizado" });
      }

      // 🔥 DEBUG (muy importante)
      console.log("ROL USUARIO:", user.role);
      console.log("ROLES PERMITIDOS:", roles);

      // 🔥 permitir admin siempre
      if (user.role === 'admin') {
        return next();
      }

      // 🔥 validar roles
      if (!roles.includes(user.role)) {
        return res.status(403).json({ error: "Acceso denegado" });
      }

      next();

    } catch (error) {
      console.error("ERROR ROLE:", error);
      res.status(500).json({ error: "Error interno" });
    }
  };
};