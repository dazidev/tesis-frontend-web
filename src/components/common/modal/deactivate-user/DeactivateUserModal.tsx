"use client";
import { useState } from "react";
import { CustomModal } from "../CustomModal";
import { CustomInput } from "../../input/CustomInput";

import { CustomSelect } from "../../select/CustomSelect";
import { UserDeactivationRequest, UserResponse } from "@/interfaces";
import toast from "react-hot-toast";
import { deactivateUser } from "@/actions";
import { useRouter } from "next/navigation";

type DeactivateUserForm = {
  type: string;
  reason: string;
};

const InitialDeactivateUserForm: DeactivateUserForm = {
  type: "",
  reason: "",
};

interface Props {
  user: UserResponse;
  open: boolean;
  close: () => void;
}

export function DeactivateUserModal({ user, open, close }: Props) {
  const [form, setForm] = useState<DeactivateUserForm>(
    InitialDeactivateUserForm,
  );

  const router = useRouter();

  const handleType = (value: string) => {
    setForm((prev) => ({ ...prev, type: value }));
  };

  const handleReason = (value: string) => {
    setForm((prev) => ({ ...prev, reason: value }));
  };

  const cleanForm = () => {
    setForm(InitialDeactivateUserForm);
  };

  const handleClose = () => {
    cleanForm();
    close();
  };

  const handleDeactivateUser = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    try {
      if (!form.reason)
        throw new Error("Debe ingresar una razón para la desactivación.");

      if (form.reason.length < 10 || form.reason.length > 250)
        throw new Error(
          "La razón debe tener mínimo 10 y máximo 250 caracteres.",
        );

      const data: UserDeactivationRequest = {
        type: form.type,
        reason: form.reason,
      };

      const response = await deactivateUser(data, user.id);

      if (!response.success) throw new Error(response.error);

      toast.success(response.message!);
      handleClose();
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }
      toast.error("Hubo un error desconocido al desactivar el usuario.");
      return;
    }
  };

  return (
    <>
      {open && (
        <CustomModal
          open={open}
          title="Desactivar usuario"
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
                className="cursor-pointer rounded-md bg-red-500 px-4 py-2 text-sm text-white"
              >
                Desactivar
              </button>
            </>
          }
        >
          <form
            id="invitate-user-form"
            className="space-y-4"
            onSubmit={handleDeactivateUser}
          >
            <div>
              <p className="text-black">El usuario que va a desactivar: </p>
              <div className="text-black pl-2">
                <p>
                  Nombre:{" "}
                  <span className="font-bold">{`${user.name} ${user.lastname}`}</span>
                </p>
                <p>
                  Correo electrónico:{" "}
                  <span className="font-bold">{`${user.email}`}</span>{" "}
                </p>
              </div>
            </div>

            <CustomSelect
              id="type"
              label="Tipo"
              placeholder="Selecciona una acción"
              value={form.type}
              setValue={handleType}
              required
              options={[
                {
                  label: "Inactivo",
                  value: "inactive",
                },
                {
                  label: "Suspendido",
                  value: "suspended",
                },
              ]}
            />
            <CustomInput
              id={"reason"}
              type={"text"}
              label={"Razón"}
              placeholder={"Ingrese la razón"}
              value={form.reason}
              setValue={handleReason}
              required
            />
          </form>
        </CustomModal>
      )}
    </>
  );
}
