export const permissions = {
  admin: {
    cliente: {
      actions: ["view", "create", "edit", "delete"],
      fields: {
        edit: ["usuarioSeleccionado", "fecha_registro", "saldo", "fichasSalud"],
      },
    },
    arriendo: {
      actions: ["view", "create", "edit", "delete"],
      fields: {
        edit: ["sala", "cliente", "fecha", "hora_inicio", "hora_fin", "estado", "monto_pagado"],
      },
    },
    categoria: {
      actions: ["view", "create", "edit", "delete"],
      fields: {
        edit: ["nombre", "descripcion"],
      },
    },
    compra: {
      actions: ["view", "create", "edit", "delete"],
      fields: {
        edit: ["cliente", "fecha", "productosComprados"],
      },
    },
    fichasalud: {
      actions: ["view", "create", "edit", "delete"],
      fields: {
        edit: ["fecha", "descripcion", "id_cliente"],
      },
    },
    gasto: {
      actions: ["view", "create", "edit", "delete"],
      fields: {
        edit: ["proveedor", "nombre", "descripcion", "monto", "fecha"],
      },
    },
    producto: {
      actions: ["view", "create", "edit", "delete"],
      fields: {
        edit: ["proveedor", "nombre", "descripcion", "precio", "stock"],
      },
    },
    productoscomprados: {
      actions: ["view", "create", "edit", "delete"],
      fields: {
        edit: ["nombre", "precio", "cantidad", "producto"],
      },
    },
    usuario: {
      actions: ["view", "create", "edit", "delete"],
      fields: {
        edit: ["nombre", "rut", "email", "telefono", "direccion", "sexo", "fecha_nacimiento", "saldo"],
      },
    },
    terapia: {
      actions: ["view", "create", "edit", "delete"],
      fields: {
        edit: ["nombre", "descripcion", "presencial", "variantes"],
      },
    },
    variante: {
      actions: ["view", "create", "edit", "delete"],
      fields: {
        edit: ["nombreVariante", "precio", "duracionMinutos", "cantidadSesiones"],
      },
    },
    sala: {
      actions: ["view", "create", "edit", "delete"],
      fields: {
        edit: ["nombre", "capacidad", "ubicacion", "descripcion"],
      },
    },
    sesion: {
      actions: ["view", "create", "edit", "delete"],
      fields: {
        edit: ["fecha", "hora_inicio", "hora_fin", "terapia", "cliente", "profesional", "estado"],
      },
    },
    sesiongroup: {
      actions: ["view", "create", "edit", "delete"],
      fields: {
        edit: ["nombre", "descripcion", "sesiones", "clientes"],
      },
    },
    proveedor: {
      actions: ["view", "create", "edit", "delete"],
      fields: {
        edit: ["nombre", "rut", "email", "telefono", "direccion"],
      },
    },
    profesional: {
      actions: ["view", "create", "edit", "delete"],
      fields: {
        edit: ["nombre", "rut", "email", "telefono", "direccion", "especialidad"],
      },
    },
  },
  editor: {
    cliente: {
      actions: ["view", "create", "edit"],
      fields: {
        edit: ["fecha_registro", "saldo", "fichasSalud"],
      },
    },
    arriendo: {
      actions: ["view", "create", "edit"],
      fields: {
        edit: ["fecha", "hora_inicio", "hora_fin", "estado"],
      },
    },
    categoria: {
      actions: ["view", "edit"],
      fields: {
        edit: ["nombre", "descripcion"],
      },
    },
    compra: {
      actions: ["view", "create"],
      fields: {
        edit: ["cliente", "fecha", "productosComprados"],
      },
    },
    fichasalud: {
      actions: ["view", "create"],
      fields: {
        edit: ["fecha", "descripcion"],
      },
    },
    gasto: {
      actions: ["view", "create", "edit"],
      fields: {
        edit: ["nombre", "descripcion", "monto", "fecha"],
      },
    },
    producto: {
      actions: ["view", "edit"],
      fields: {
        edit: ["nombre", "descripcion", "stock"],
      },
    },
    productoscomprados: {
      actions: ["view", "edit"],
      fields: {
        edit: ["cantidad"],
      },
    },
    usuario: {
      actions: ["view", "edit"],
      fields: {
        edit: ["telefono", "direccion", "saldo"],
      },
    },
    terapia: {
      actions: ["view", "edit"],
      fields: {
        edit: ["descripcion", "presencial"],
      },
    },
    variante: {
      actions: ["view", "edit"],
      fields: {
        edit: ["precio", "duracionMinutos"],
      },
    },
    sala: {
      actions: ["view", "edit"],
      fields: {
        edit: ["descripcion", "capacidad"],
      },
    },
    sesion: {
      actions: ["view", "create", "edit"],
      fields: {
        edit: ["fecha", "hora_inicio", "hora_fin", "estado"],
      },
    },
    sesiongroup: {
      actions: ["view", "edit"],
      fields: {
        edit: ["descripcion", "clientes"],
      },
    },
    proveedor: {
      actions: ["view", "edit"],
      fields: {
        edit: ["telefono", "direccion"],
      },
    },
    profesional: {
      actions: ["view", "edit"],
      fields: {
        edit: ["telefono", "direccion", "especialidad"],
      },
    },
  },
  viewer: {
    cliente: {
      actions: ["view"],
      fields: {
        edit: [],
      },
    },
    arriendo: {
      actions: ["view"],
      fields: {
        edit: [],
      },
    },
    categoria: {
      actions: ["view"],
      fields: {
        edit: [],
      },
    },
    compra: {
      actions: ["view"],
      fields: {
        edit: [],
      },
    },
    fichasalud: {
      actions: ["view"],
      fields: {
        edit: [],
      },
    },
    gasto: {
      actions: ["view"],
      fields: {
        edit: [],
      },
    },
    producto: {
      actions: ["view"],
      fields: {
        edit: [],
      },
    },
    productoscomprados: {
      actions: ["view"],
      fields: {
        edit: [],
      },
    },
    usuario: {
      actions: ["view"],
      fields: {
        edit: [],
      },
    },
    terapia: {
      actions: ["view"],
      fields: {
        edit: [],
      },
    },
    variante: {
      actions: ["view"],
      fields: {
        edit: [],
      },
    },
    sala: {
      actions: ["view"],
      fields: {
        edit: [],
      },
    },
    sesion: {
      actions: ["view"],
      fields: {
        edit: [],
      },
    },
    sesiongroup: {
      actions: ["view"],
      fields: {
        edit: [],
      },
    },
    proveedor: {
      actions: ["view"],
      fields: {
        edit: [],
      },
    },
    profesional: {
      actions: ["view"],
      fields: {
        edit: [],
      },
    },
  },
};
