export const logEntityLabels: Record<string, string> = {
  USER: "Usuarios",
  PROCESS: "Procesos",
  STAGE: "Etapas",
  SUBSTAGE: "Subetapas",
  FOLDER: "Carpetas",
  FILE: "Archivos",
  TASK: "Tareas",
};

export const logActionLabels: Record<string, string> = {
  DEACTIVATE_USER: "Desactivar usuario",
  INVITATION_USER: "Invitar usuario",

  CREATE_PROCESS: "Crear proceso",
  DEACTIVATE_PROCESS: "Desactivar proceso",
  DELETE_PROCESS: "Eliminar proceso",
  INIT_PROCESS: "Iniciar proceso",

  CREATE_STAGE: "Crear etapa",
  CLOSE_STAGE: "Cerrar etapa",
  DELETE_STAGE: "Eliminar etapa",

  CREATE_SUBSTAGE: "Crear subetapa",
  CLOSE_SUBSTAGE: "Cerrar subetapa",
  DELETE_SUBSTAGE: "Eliminar subetapa",

  CREATE_FOLDER: "Crear carpeta",
  UPDATE_FOLDER: "Actualizar carpeta",
  DEACTIVATE_FOLDER: "Desactivar carpeta",
  DELETE_FOLDER: "Eliminar carpeta",

  CREATE_FILE: "Subir archivo",
  VIEW_FILE: "Visualizar archivo",
  DOWNLOAD_FILE: "Descargar archivo",
  UPDATE_FILE: "Actualizar archivo",
  DEACTIVATE_FILE: "Desactivar archivo",
  DELETE_FILE: "Eliminar archivo",

  CREATE_TASK: "Crear tarea",
  UPDATE_TASK: "Actualizar tarea",
  COMPLETE_TASK: "Completar tarea",
  REOPEN_TASK: "Reabrir tarea",
  DEACTIVATE_TASK: "Desactivar tarea",
};

export const getLogEntityLabel = (entity: string | null): string => {
  if (!entity) return "Sin categoría";

  return logEntityLabels[entity] ?? entity;
};

export const getLogActionLabel = (action: string): string => {
  return logActionLabels[action] ?? action.replaceAll("_", " ").toLowerCase();
};

export const formatLogDate = (date: string): string => {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(new Date(date));
};
