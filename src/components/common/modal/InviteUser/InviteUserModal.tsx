"use client";
import { useState } from "react";
import { CustomModal } from "../CustomModal";
import { CustomInput } from "../../input/CustomInput";

import { CustomSelect } from "../../select/CustomSelect";
import { sendUserInvitation } from "@/actions";
import { UserInvitationRequest } from "@/interfaces";
import { isUserRole, RegExp } from "@/infrastructure";
import toast from "react-hot-toast";

type InviteUserForm = {
  email: string;
  role: string;
};

const InitialInvitateUserForm: InviteUserForm = {
  email: "",
  role: "",
};

export function InviteUserModal() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<InviteUserForm>(InitialInvitateUserForm);

  const handleEmail = (value: string) => {
    setForm((prev) => ({ ...prev, email: value }));
  };

  const handleRole = (value: string) => {
    setForm((prev) => ({ ...prev, role: value }));
  };

  const cleanForm = () => {
    setForm(InitialInvitateUserForm);
  };

  const handleClose = () => {
    cleanForm();
    setOpen(false);
  };

  const handleSendUserInvitation = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    try {
      if (!RegExp.email.test(form.email))
        throw new Error("El correo electrónico debe ser válido.");
      if (!isUserRole(form.role)) throw new Error("El rol debe ser válido.");

      const data: UserInvitationRequest = {
        toEmail: form.email,
        role: form.role,
      };

      const response = await sendUserInvitation(data);

      if (!response.success) throw new Error(response.error);

      toast.success(response.message!);
      cleanForm();
    } catch (error: unknown) {
      if (typeof error === "string") {
        toast.error(error);
        return;
      }
      toast.error("Hubo un error desconocido al generar la invitación.");
      return;
    }
  };

  return (
    <>
      <button
        className="flex justify-center w-40 bg-pwhite p-2 text-black/60 
          border border-pborder shadow-sm sm:rounded-lg
          hover:cursor-pointer hover:text-black/80 hover:scale-102"
        onClick={() => setOpen(true)}
      >
        <span className="text-base uppercase">Invitar usuario</span>
      </button>
      {open && (
        <CustomModal
          open={open}
          title="Invitar usuario"
          onClose={() => handleClose()}
          footer={
            <>
              <button
                type="button"
                className="cursor-pointer rounded-md border px-4 py-2 text-sm text-black/80"
                onClick={() => handleClose()}
              >
                Cancelar
              </button>

              <button
                type="submit"
                form="invitate-user-form"
                className="cursor-pointer rounded-md bg-black px-4 py-2 text-sm text-white"
              >
                Invitar
              </button>
            </>
          }
        >
          <form
            id="invitate-user-form"
            className="space-y-4"
            onSubmit={handleSendUserInvitation}
          >
            <CustomInput
              id={"email"}
              type={"email"}
              label={"Correo electrónico"}
              placeholder={"Ingrese el correo electrónico"}
              value={form.email}
              setValue={handleEmail}
              required
            />
            <CustomSelect
              id="role"
              label="Rol"
              placeholder="Selecciona un rol"
              value={form.role}
              setValue={handleRole}
              required
              options={[
                {
                  label: "Administrador",
                  value: "admin",
                },
                {
                  label: "Abogado",
                  value: "lawyer",
                },
                {
                  label: "Cliente",
                  value: "client",
                },
              ]}
            />
          </form>
        </CustomModal>
      )}
    </>
  );
}
