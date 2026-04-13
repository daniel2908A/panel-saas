module.exports = (...rolesPermitidos) => {
  return (req, res, next) => {
    try {
      // =======================
      // VALIDAR USUARIO
      // =======================
      if (!req.user || !req.user.role) {
        return res.status(401).json({
          error: "No autorizado"
        });
      }

      const userRole = String(req.user.role).toLowerCase();
      const roles = rolesPermitidos.map(r => String(r).toLowerCase());

      // =======================
      // ADMIN SIEMPRE PASA
      // =======================
      if (userRole === 'admin') {
        return next();
      }

      // =======================
      // VALIDAR PERMISOS
      // =======================
      if (!roles.includes(userRole)) {
        return res.status(403).json({
          error: "Acceso denegado"
        });
      }

      next();

    } catch (err) {
      console.error("ERROR ROLE MIDDLEWARE:", err);

      return res.status(500).json({
        error: "Error interno del servidor"
      });
    }
  };
};