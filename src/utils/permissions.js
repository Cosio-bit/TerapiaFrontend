export const permissions = {
  admin: {
    cliente: {
      actions: ["view", "create", "edit", "delete"],
      fields: { edit: ["*"] },
    },
    arriendo: {
      actions: ["view", "create", "edit", "delete"],
      fields: { edit: ["*"] },
    },
  },
  editor: {
    cliente: {
      actions: ["view", "create", "edit"],
      fields: { edit: ["nombre", "telefono"] },
    },
    arriendo: {
      actions: ["view", "create", "edit"],
      // Ejemplo campos editables para editor en arriendo,
      // ajustar según reglas de negocio específicas
      fields: { edit: ["fecha", "hora_inicio", "hora_fin", "estado"] },
    },
  },
  viewer: {
    cliente: {
      actions: ["view"],
      fields: { edit: [] },
    },
    arriendo: {
      actions: ["view"],
      fields: { edit: [] },
    },
  },
};
