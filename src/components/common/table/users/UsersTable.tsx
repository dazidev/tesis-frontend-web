"use client";

import {
  CustomTable,
  DeactivateUserModal,
  type Column,
} from "@/components/common";
import { UserResponse } from "@/interfaces";
import { useState } from "react";

import { FaTrash, FaPen } from "react-icons/fa";

interface Props {
  users: UserResponse[];
}

interface OpenModal {
  deactivate: boolean;
  edit: boolean;
}

export function UsersTable({ users }: Props) {
  const [openModal, setOpenModal] = useState<OpenModal>({
    deactivate: false,
    edit: false,
  });
  const [targetUser, setTargetUser] = useState<UserResponse>();

  const handleEdit = (user: UserResponse) => {
    console.log("Editar usuario", user.id);
  };

  const handleDelete = (user: UserResponse) => {
    setTargetUser(user);
    setOpenModal((prev) => ({ ...prev, deactivate: true }));
  };

  const closeOpenModal = () => {
    setOpenModal({ deactivate: false, edit: false });
  };

  const userColumns: Column<UserResponse>[] = [
    {
      header: "Usuario",
      value: (user) => `${user.name} ${user.lastname}`,
    },
    {
      header: "Correo",
      value: (user) => user.email,
    },
    {
      header: "Rol",
      value: (user) => user.roles[0] ?? "Sin rol",
    },
    {
      header: "Estado",
      value: (user) => (
        <span
          className={`px-2 py-1 rounded-lg ${
            user.status === "active"
              ? "bg-green-300/70 text-green-800"
              : "bg-red-300/70 text-red-900"
          }`}
        >
          {user.status === "active" ? "Activo" : "Inactivo/Suspendido"}
        </span>
      ),
    },
    {
      header: "Acciones",
      className: "text-left",
      value: (user) => (
        <div className="flex justify-start gap-2">
          <button
            type="button"
            aria-label={`Editar usuario ${user.name}`}
            title="Editar usuario"
            className="
              flex h-8 w-8 items-center justify-center rounded-md
              border border-gray-300
              bg-gray-50 text-gray-700
              cursor-pointer
              transition-colors duration-200
              hover:bg-gray-100 hover:text-gray-900 focus:outline-none
              disabled:cursor-not-allowed disabled:opacity-50
            "
            onClick={() => handleEdit(user)}
          >
            <FaPen className="h-4 w-4" />
          </button>

          <button
            type="button"
            aria-label={`Eliminar usuario ${user.name}`}
            title="Eliminar usuario"
            className="
              flex h-8 w-8 items-center justify-center rounded-md
              border border-red-300
              bg-red-600/10 text-red-600
              cursor-pointer
              transition-colors duration-200
              hover:bg-red-600/20 hover:text-red-700 focus:outline-none
              disabled:cursor-not-allowed disabled:opacity-50
            "
            onClick={() => handleDelete(user)}
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
        name="Usuarios Registrados"
        items={users}
        columns={userColumns}
        getKey={(user) => user.id}
        emptyMessage="No hay usuarios registrados"
      />
      {openModal.deactivate && (
        <DeactivateUserModal
          user={targetUser!}
          open={openModal.deactivate}
          close={closeOpenModal}
        />
      )}
    </>
  );
}
