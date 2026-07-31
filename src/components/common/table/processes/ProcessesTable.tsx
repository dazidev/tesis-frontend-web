"use client";

import {
  CustomTable,
  DeactivateProcessModal,
  DeactivateUserModal,
  type Column,
} from "@/components/common";
import { getDateToString } from "@/infrastructure";
import { ProcessResponse } from "@/interfaces";
import { useState } from "react";

import { FaTrash, FaEye } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";

interface Props {
  processes: ProcessResponse[];
}

interface OpenModal {
  deactivate: boolean;
  edit: boolean;
}

export function ProcessesTable({ processes }: Props) {
  const [openModal, setOpenModal] = useState<OpenModal>({
    deactivate: false,
    edit: false,
  });
  const [targetProcess, setTargetProcess] = useState<ProcessResponse>();

  const handleEdit = (user: ProcessResponse) => {
    console.log("Editar usuario", user.id);
  };

  const handleDelete = (user: ProcessResponse) => {
    setTargetProcess(user);
    setOpenModal((prev) => ({ ...prev, deactivate: true }));
  };

  const closeOpenModal = () => {
    setOpenModal({ deactivate: false, edit: false });
  };

  const processColumns: Column<ProcessResponse>[] = [
    {
      header: "Expediente",
      value: (process) => process.caseFileNumber,
    },
    {
      header: "Juzgado",
      value: (process) => process.courtNumber,
    },
    {
      header: "Creado",
      value: (process) => getDateToString(new Date(process.createdAt)),
    },
    {
      header: "Estado",
      value: (process) => (
        <span
          className={`px-2 py-1 rounded-lg ${
            process.status === "created"
              ? "bg-green-300/70 text-green-800"
              : "bg-red-300/70 text-red-900"
          }`}
        >
          {process.status === "created" ? "Creado" : "Inactivo/Suspendido"}
        </span>
      ),
    },
    {
      header: "Acciones",
      className: "text-left",
      value: (process) => (
        <div className="flex justify-start gap-2">
          {process.status === "created" && (
            <button
              type="button"
              aria-label={`Iniciar proceso ${process.caseFileNumber}`}
              title="Iniciar proceso"
              className="
              flex h-8 w-8 items-center justify-center rounded-md
              border border-gray-300
              bg-gray-50 text-green-700
              cursor-pointer
              transition-colors duration-200
              hover:bg-green-100 hover:text-green-900 focus:outline-none
              disabled:cursor-not-allowed disabled:opacity-50
            "
              onClick={() => handleEdit(process)}
            >
              <FaGear className="h-4 w-4" />
            </button>
          )}

          {process.status !== "created" && process.status !== "deleted" && (
            <button
              type="button"
              aria-label={`Ver proceso ${process.caseFileNumber}`}
              title="Ver proceso"
              className="
              flex h-8 w-8 items-center justify-center rounded-md
              border border-gray-300
              bg-gray-50 text-blue-700
              cursor-pointer
              transition-colors duration-200
              hover:bg-blue-100 hover:text-blue-900 focus:outline-none
              disabled:cursor-not-allowed disabled:opacity-50
            "
              onClick={() => handleEdit(process)}
            >
              <FaGear className="h-4 w-4" />
            </button>
          )}

          <button
            type="button"
            aria-label={`Eliminar proceso ${process.caseFileNumber}`}
            title="Eliminar proceso"
            className="
              flex h-8 w-8 items-center justify-center rounded-md
              border border-red-300
              bg-red-600/10 text-red-600
              cursor-pointer
              transition-colors duration-200
              hover:bg-red-600/20 hover:text-red-700 focus:outline-none
              disabled:cursor-not-allowed disabled:opacity-50
            "
            onClick={() => handleDelete(process)}
          >
            <FaTrash className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <CustomTable
        name="Procesos Registrados"
        items={processes}
        columns={processColumns}
        getKey={(process) => process.id}
        emptyMessage="No hay procesos registrados"
      />

      {openModal.deactivate && (
        <DeactivateProcessModal
          process={targetProcess!}
          open={openModal.deactivate}
          close={closeOpenModal}
        />
      )}
    </>
  );
}
