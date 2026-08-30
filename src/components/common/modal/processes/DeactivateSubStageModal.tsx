"use client";
import { useState } from "react";
import { CustomInput } from "../../input/CustomInput";
import { CustomModal } from "../CustomModal";
import { OptionModal } from "@/components/process/ProcessMapView";
import { ProcessStage, SubstageNode } from "@/interfaces";
import { deactivateSubstage } from "@/actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Props {
  item: ProcessStage | SubstageNode;
  open: boolean;
  handleModal: (option: keyof OptionModal, value: boolean) => void;
}

function isSubstageNode(
  value: ProcessStage | SubstageNode,
): value is SubstageNode {
  return "stageId" in value;
}

export function DeactivateSubStageModal({ item, open, handleModal }: Props) {
  const [reason, setReason] = useState("");
  const router = useRouter();

  const handleClose = () => {
    handleModal("deactivateSubStage", false);
  };

  const handleDeactivate = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!reason)
        throw new Error("Debe ingresar una razón para la desactivación.");

      if (reason.length < 10 || reason.length > 250)
        throw new Error(
          "La razón debe tener mínimo 10 y máximo 250 caracteres.",
        );

      if (isSubstageNode(item)) {
        const response = await deactivateSubstage({ reason }, item.id);
        if (!response.success) throw new Error(response.error);

        toast.success(response.message!);
        handleClose();
        router.refresh();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }
      toast.error("Hubo un error desconocido al desactivar la sub/etapa.");
      return;
    }
  };

  return (
    <>
      {open && (
        <CustomModal
          open={open}
          title={`Desactivar subetapa`}
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
            onSubmit={handleDeactivate}
          >
            <CustomInput
              id={"reason"}
              type={"text"}
              label={"Razón"}
              placeholder={"Ingrese la razón"}
              value={reason}
              setValue={setReason}
              required
            />
          </form>
        </CustomModal>
      )}
    </>
  );
}
