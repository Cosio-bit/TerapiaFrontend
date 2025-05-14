export const permissions = {
    admin: {
      arriendo: ["view", "create", "edit", "delete"],
      usuario: ["view", "create", "edit", "delete"],
      cliente: ["view", "create", "edit", "delete"],
      venta: ["view", "create", "edit", "delete"],
      // Add more entities here if needed
    },
    editor: {
      arriendo: ["view", "create", "delete"],
      usuario: ["view", "create", "delete"],
      cliente: ["view", "create", "delete"],
      venta: ["view", "create", "delete"],
      // Add more entities here if needed
    },
    viewer: {
      arriendo: ["view"],
      usuario: ["view"],
      cliente: ["view"],
      venta: ["view"],
      // Add more entities here if needed
    }
  };
  