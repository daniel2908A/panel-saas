// =======================
// ROLES DEL SISTEMA
// =======================
const ROLES = {
  ADMIN: 'admin',
  SUPER_RESELLER: 'super_reseller',
  RESELLER: 'reseller',
  CLIENT: 'client'
};

// =======================
// JERARQUÍA
// =======================
const ROLE_LEVEL = {
  admin: 4,
  super_reseller: 3,
  reseller: 2,
  client: 1
};

// =======================
// NORMALIZAR ROL
// =======================
const normalizeRole = (role) => {
  return String(role || '').toLowerCase().trim();
};

// =======================
// PERMISOS
// =======================
const canManage = (actorRole, targetRole) => {
  const actor = normalizeRole(actorRole);
  const target = normalizeRole(targetRole);

  if (!ROLE_LEVEL[actor] || !ROLE_LEVEL[target]) {
    return false;
  }

  return ROLE_LEVEL[actor] > ROLE_LEVEL[target];
};

// =======================
// EXPORT
// =======================
module.exports = {
  ROLES,
  ROLE_LEVEL,
  canManage,
  normalizeRole
};