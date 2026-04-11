// 🔥 ROLES DEL SISTEMA
const ROLES = {
  ADMIN: 'admin',
  SUPERRESELLER: 'superreseller',
  RESELLER: 'reseller',
  CLIENTE: 'cliente',
  SOCIO: 'socio'
};

// 🔥 JERARQUÍA (IMPORTANTE)
const ROLE_LEVEL = {
  admin: 5,
  superreseller: 4,
  reseller: 3,
  cliente: 2,
  socio: 1
};

// 🔥 VERIFICAR SI UN ROL TIENE PERMISO SOBRE OTRO
const canManage = (actorRole, targetRole) => {
  return ROLE_LEVEL[actorRole] > ROLE_LEVEL[targetRole];
};

// 🔥 EXPORTAR
module.exports = {
  ROLES,
  ROLE_LEVEL,
  canManage
};