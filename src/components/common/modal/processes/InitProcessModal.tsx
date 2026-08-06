"use client";
import { CustomModal } from "../CustomModal";

import { ProcessResponse } from "@/interfaces";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getProcessTypeName } from "@/infrastructure";
import { initProcess } from "@/actions";

interface Props {
  process: ProcessResponse;
  open: boolean;
  close: () => void;
}

export function InitProcessModal({ process, open, close }: Props) {
  const router = useRouter();

  const handleClose = () => {
    close();
  };

  const handleInitProcess = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await initProcess(process.id);

      if (!response.success) throw new Error(response.error);

      toast.success(response.message!);
      handleClose();
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }
      toast.error("Hubo un error desconocido al iniciar el proceso.");
      return;
    }
  };

  return (
    <>
      {open && (
        <CustomModal
          open={open}
          title={`Iniciar proceso`}
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
                Iniciar
              </button>
            </>
          }
        >
          <form
            id="invitate-user-form"
            className="space-y-4"
            onSubmit={handleInitProcess}
          >
            <div className="space-y-4">
              <p className="text-black">El proceso que va a iniciar:</p>
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
          </form>
        </CustomModal>
      )}
    </>
  );
}
