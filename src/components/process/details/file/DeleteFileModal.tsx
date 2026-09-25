"use client";

import { CustomModal } from "@/components/common/modal/CustomModal";
import { DigitalFileResponse } from "@/interfaces";
import { deleteFile } from "@/actions";
import toast from "react-hot-toast";

interface Props {
  file: DigitalFileResponse;
  open: boolean;
  handleModal: (option: "add" | "delete", value: boolean) => void;
  removeFile: (id: string) => void;
}

export function DeleteFileModal({
  file,
  open,
  handleModal,
  removeFile,
}: Props) {
  const handleDeleteFile = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await deleteFile(file.id);

      if (!response.success) {
        throw new Error(response.error);
      }

      toast.success(
        response.message ?? "El archivo ha sido eliminado correctamente.",
      );

      removeFile(file.id);

      handleModal("delete", false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }

      toast.error("Hubo un error desconocido al eliminar el archivo.");
    }
  };

  return (
    <>
      {open && (
        <CustomModal
          open={open}
          title="Eliminar archivo"
          onClose={() => handleModal("delete", false)}
          footer={
            <>
              <button
                type="button"
                className="cursor-pointer rounded-md border px-4 py-2 text-sm text-black/80"
                onClick={() => handleModal("delete", false)}
              >
                Cancelar
              </button>

              <button
                type="submit"
                form="delete-file-form"
                className="cursor-pointer rounded-md bg-red-500 px-4 py-2 text-sm text-white"
              >
                Eliminar
              </button>
            </>
          }
        >
          <form
            id="delete-file-form"
            className="space-y-4"
            onSubmit={handleDeleteFile}
          >
            <div>
              <p className="text-black">El archivo que va a eliminar:</p>

              <div className="pl-2 text-black">
                <p>
                  Nombre: <span className="font-bold">{file.name}</span>
                </p>

                <p>
                  Descripción:{" "}
                  <span className="font-bold">{file.description}</span>
                </p>
              </div>
            </div>
          </form>
        </CustomModal>
      )}
    </>
  );
}
