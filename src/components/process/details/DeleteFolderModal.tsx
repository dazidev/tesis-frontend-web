"use client";

import { useState } from "react";
import { CustomModal } from "@/components/common/modal/CustomModal";
import { CustomInput } from "@/components/common";
import {
  BasicDigitalFolderResponse,
  FolderDeactivationRequest,
} from "@/interfaces";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteFolder } from "@/actions";
import { OptionModalFolder } from "./ViewStageOrSubModal";

type DeleteFolderForm = {
  reason: string;
};

const InitialDeleteFolderForm: DeleteFolderForm = {
  reason: "",
};

interface Props {
  folder: BasicDigitalFolderResponse;
  open: boolean;
  handleModal: (option: keyof OptionModalFolder, value: boolean) => void;
  removeFolder: (id: string) => void;
}

export function DeleteFolderModal({
  folder,
  open,
  handleModal,
  removeFolder,
}: Props) {
  const [form, setForm] = useState<DeleteFolderForm>(InitialDeleteFolderForm);

  const router = useRouter();

  const handleReason = (value: string) => {
    setForm((prev) => ({
      ...prev,
      reason: value,
    }));
  };

  const cleanForm = () => {
    setForm(InitialDeleteFolderForm);
  };

  const handleClose = () => {
    cleanForm();
    handleModal("deleteFolder", false);
  };

  const handleDeleteFolder = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!form.reason) {
        throw new Error("Debe ingresar una razón para la eliminación.");
      }

      if (form.reason.length < 10 || form.reason.length > 250) {
        throw new Error(
          "La razón debe tener mínimo 10 y máximo 250 caracteres.",
        );
      }

      const data: FolderDeactivationRequest = {
        reason: form.reason,
      };

      const response = await deleteFolder(folder.id, data);

      if (!response.success) {
        throw new Error(response.error);
      }

      toast.success(response.message!);

      removeFolder(folder.id);

      handleClose();

      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);

        return;
      }

      toast.error("Hubo un error desconocido al eliminar la carpeta.");
    }
  };

  return (
    <>
      {open && (
        <CustomModal
          open={open}
          title="Eliminar carpeta"
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
                form="delete-folder-form"
                className="cursor-pointer rounded-md bg-red-500 px-4 py-2 text-sm text-white"
              >
                Eliminar
              </button>
            </>
          }
        >
          <form
            id="delete-folder-form"
            className="space-y-4"
            onSubmit={handleDeleteFolder}
          >
            <div>
              <p className="text-black">La carpeta que va a eliminar:</p>

              <div className="pl-2 text-black">
                <p>
                  Nombre: <span className="font-bold">{folder.name}</span>
                </p>

                <p>
                  Descripción:{" "}
                  <span className="font-bold">{folder.description}</span>
                </p>
              </div>
            </div>

            <p className="text-sm text-red-600">
              Los documentos contenidos en esta carpeta también serán
              eliminados.
            </p>

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
