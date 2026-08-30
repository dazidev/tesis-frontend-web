"use client";
import { useState } from "react";
import { CustomModal } from "../CustomModal";
import { CustomInput } from "../../input/CustomInput";

import { ProcessResponse, ProcessDeactivationRequest } from "@/interfaces";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getProcessTypeName } from "@/infrastructure";
import { deactivateProcess } from "@/actions";

type DeactivateProcessForm = {
  reason: string;
};

const InitialDeactivateProcessForm: DeactivateProcessForm = {
  reason: "",
};

interface Props {
  process: ProcessResponse;
  open: boolean;
  close: () => void;
}

export function DeactivateProcessModal({ process, open, close }: Props) {
  const [form, setForm] = useState<DeactivateProcessForm>(
    InitialDeactivateProcessForm,
  );

  const router = useRouter();

  const handleType = (value: string) => {
    setForm((prev) => ({ ...prev, type: value }));
  };

  const handleReason = (value: string) => {
    setForm((prev) => ({ ...prev, reason: value }));
  };

  const cleanForm = () => {
    setForm(InitialDeactivateProcessForm);
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

      const data: ProcessDeactivationRequest = {
        reason: form.reason,
      };

      const response = await deactivateProcess(process.id, data);

      if (!response.success) throw new Error(response.error);

      toast.success(response.message!);
      handleClose();
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }
      toast.error("Hubo un error desconocido al desactivar el proceso.");
      return;
    }
  };

  return (
    <>
      {open && (
        <CustomModal
          open={open}
          title={`${process.status === "created" ? "Eliminar" : "Desactivar"} proceso`}
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
                {`${process.status === "created" ? "Eliminar" : "Desactivar"}`}
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
              <p className="text-black">{`El proceso que va a ${process.status === "created" ? "eliminar" : "desactivar"}: `}</p>
              <div className="text-black pl-2">
                <p>
                  Expediente:{" "}
                  <span className="font-bold">{`${process.caseFileNumber}`}</span>
                </p>
                <p>
                  Juzgado:{" "}
                  <span className="font-bold">{`${process.courtNumber}`}</span>
                </p>
                <p>
                  Tipo:{" "}
                  <span className="font-bold">
                    {getProcessTypeName(process.type)}
                  </span>{" "}
                </p>
              </div>
            </div>
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
