module.exports = function allowRoles(...rolesPermitidos) {
  return (req, res, next) => {
    try {
      const user = req.user;

      // =======================
      // VALIDAR USUARIO
      // =======================
      if (!user || !user.role) {
        return res.status(401).json({
          error: "No autorizado"
        });
      }

      // =======================
      // NORMALIZAR ROLES
      // =======================
      const userRole = String(user.role).toLowerCase();
      const roles = rolesPermitidos.map(r => String(r).toLowerCase());

      // =======================
      // VALIDAR PERMISOS
      // =======================
      if (!roles.includes(userRole)) {
        return res.status(403).json({
          error: "No tienes permisos"
        });
      }

      next();

    } catch (error) {
      console.error("ERROR ROLE MIDDLEWARE:", error);

      return res.status(500).json({
        error: "Error interno del servidor"
      });
    }
  };
};