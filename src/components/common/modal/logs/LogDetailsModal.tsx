"use client";

import { LogResponse } from "@/interfaces";
import {
  formatLogDate,
  getLogActionLabel,
  getLogEntityLabel,
} from "@/infrastructure/utils/log-labels";
import { CustomModal } from "../CustomModal";

interface Props {
  log: LogResponse;
  open: boolean;
  close: () => void;
}

export function LogDetailsModal({ log, open, close }: Props) {
  const userName = log.user
    ? `${log.user.name} ${log.user.lastname}`
    : "No disponible";

  const details = [
    {
      label: "ID del registro",
      value: log.id,
    },
    {
      label: "Fecha y hora",
      value: formatLogDate(log.createdAt),
    },
    {
      label: "Usuario responsable",
      value: userName,
    },
    {
      label: "Correo electrónico",
      value: log.user?.email ?? "No disponible",
    },
    {
      label: "ID del usuario",
      value: log.userId ?? "No disponible",
    },
    {
      label: "Categoría",
      value: getLogEntityLabel(log.entity),
    },
    {
      label: "Acción",
      value: getLogActionLabel(log.action),
    },
    {
      label: "Código de acción",
      value: log.action,
    },
    {
      label: "Entidad afectada",
      value: log.affected ?? "No disponible",
    },
  ];

  return (
    <CustomModal
      open={open}
      title="Detalles del registro"
      onClose={close}
      width="max-w-2xl"
      footer={
        <button
          type="button"
          onClick={close}
          className="cursor-pointer rounded-md bg-pbutton px-4 py-2 text-sm text-white hover:opacity-90"
        >
          Cerrar
        </button>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="overflow-hidden rounded-lg border border-pborder">
          {details.map((detail) => (
            <div
              key={detail.label}
              className="grid grid-cols-1 gap-1 border-b border-pborder px-4 py-3 last:border-b-0 sm:grid-cols-3 sm:gap-3"
            >
              <span className="text-sm font-medium text-pgray">
                {detail.label}
              </span>

              <span className="break-all text-sm text-gray-700 sm:col-span-2">
                {detail.value}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-medium text-pgray">Descripción</h3>

          <div className="min-h-20 whitespace-pre-wrap break-words rounded-lg border border-pborder bg-pwhite p-4 text-sm text-gray-700">
            {log.description || "Sin descripción"}
          </div>
        </div>
      </div>
    </CustomModal>
  );
}
