import { permissions } from "./permissions";

export function can(role, action, entity) {
  const rolePerms = permissions[role];
  if (!rolePerms) return false;
  const entityPerms = rolePerms[entity];
  if (!entityPerms) return false;
  return entityPerms.actions.includes(action);
}
export function canEditField(role, entity, field) {
  const rolePerms = permissions[role];
  if (!rolePerms) return false;
  const entityPerms = rolePerms[entity];
  if (!entityPerms) return false;
  const fieldsAllowed = entityPerms.fields?.edit || [];
  return fieldsAllowed.includes("*") || fieldsAllowed.includes(field);
}
export function canDelete(role, entity) {
  const rolePerms = permissions[role];
  if (!rolePerms) return false;
  const entityPerms = rolePerms[entity];
  if (!entityPerms) return false;
  return entityPerms.actions.includes("delete");
}
export function canCreate(role, entity) {
  const rolePerms = permissions[role];
  if (!rolePerms) return false;
  const entityPerms = rolePerms[entity];
  if (!entityPerms) return false;
  return entityPerms.actions.includes("create");
}
export function canView(role, entity) {
  const rolePerms = permissions[role];
  if (!rolePerms) return false;
  const entityPerms = rolePerms[entity];
  if (!entityPerms) return false;
  return entityPerms.actions.includes("view");
}
