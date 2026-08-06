export const processStatusStyles = {
  created: "bg-blue-300/70 text-blue-800",
  opened: "bg-green-300/70 text-green-800",
  closed: "bg-yellow-300/70 text-yellow-800",
  deleted: "bg-red-300/70 text-red-800",
} as const;

export const processStatusNames = {
  created: "Creado",
  opened: "Abierto",
  closed: "Cerrado",
  deleted: "Eliminado",
} as const;
