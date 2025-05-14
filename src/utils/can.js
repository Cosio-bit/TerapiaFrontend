import { permissions } from "./permissions";

/**
 * Check if a role can perform an action on an entity
 * @param {string} role - Role name (admin, editor, viewer)
 * @param {string} action - Action name (view, create, edit, delete)
 * @param {string} entity - Entity name (arriendo, usuario, etc)
 * @returns {boolean}
 */
export function can(role, action, entity) {
  if (!permissions[role]) return false; // No such role
  if (!permissions[role][entity]) return false; // No such entity
  return permissions[role][entity].includes(action);
}
