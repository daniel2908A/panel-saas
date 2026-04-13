const adminMiddleware = (req, res, next) => {
  if(!req.user) return res.status(401).json({ error: "No autorizado" });
  if(req.user.role !== 'owner') return res.status(403).json({ error: "Permiso denegado" });
  next();
};

module.exports = adminMiddleware;