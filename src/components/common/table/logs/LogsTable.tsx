"use client";

import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { CustomTable, type Column } from "@/components/common";
import { LogResponse } from "@/interfaces";
import {
  formatLogDate,
  getLogActionLabel,
  getLogEntityLabel,
} from "@/infrastructure/utils/log-labels";
import { LogDetailsModal } from "../../modal/logs/LogDetailsModal";

interface Props {
  logs: LogResponse[];
}

export function LogsTable({ logs }: Props) {
  const [selectedLog, setSelectedLog] = useState<LogResponse | null>(null);

  const columns: Column<LogResponse>[] = [
    {
      header: "Fecha y hora",
      value: (log) => formatLogDate(log.createdAt),
    },
    {
      header: "Usuario",
      value: (log) =>
        log.user ? `${log.user.name} ${log.user.lastname}` : "No disponible",
    },
    {
      header: "Categoría",
      value: (log) => (
        <span className="inline-block rounded-lg bg-sbutton px-2 py-1 text-sm text-pgray">
          {getLogEntityLabel(log.entity)}
        </span>
      ),
    },
    {
      header: "Acción",
      value: (log) => getLogActionLabel(log.action),
    },
    {
      header: "Descripción",
      value: (log) => (
        <span className="block max-w-64 truncate" title={log.description}>
          {log.description || "Sin descripción"}
        </span>
      ),
    },
    {
      header: "Acciones",
      value: (log) => (
        <div className="flex justify-start gap-2">
          <button
            type="button"
            aria-label={`Ver detalles del registro ${log.id}`}
            title="Ver detalles"
            onClick={() => setSelectedLog(log)}
            className="
              flex h-8 w-8 cursor-pointer items-center
              justify-center rounded-md border border-blue-300
              bg-blue-50 text-blue-700
              transition-colors duration-200
              hover:bg-blue-100 hover:text-blue-900
            "
          >
            <FaEye className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <CustomTable
        name="Registro de actividad"
        items={logs}
        columns={columns}
        getKey={(log) => log.id}
        emptyMessage="No se encontraron registros"
      />

      {selectedLog && (
        <LogDetailsModal
          log={selectedLog}
          open={true}
          close={() => setSelectedLog(null)}
        />
      )}
    </>
  );
}
