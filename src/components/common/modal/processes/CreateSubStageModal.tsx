"use client";
import { useState } from "react";
import { CustomModal } from "../CustomModal";
import { CustomInput } from "../../input/CustomInput";
import toast from "react-hot-toast";
import { createSubStage } from "@/actions";
import { useRouter } from "next/navigation";
import {
  CreateSubStageRequest,
  ProcessStage,
  SubstageNode,
} from "@/interfaces";
import { OptionModal } from "@/components/process/ProcessMapView";

export function isProcessStage(
  value: ProcessStage | SubstageNode,
): value is ProcessStage {
  return !("stageId" in value);
}

export function isSubstageNode(
  value: ProcessStage | SubstageNode,
): value is SubstageNode {
  return "stageId" in value;
}

const InitialCreateProcessForm: CreateSubStageRequest = {
  name: "",
  description: "",
  parentSubstageId: undefined,
};

interface Props {
  item: ProcessStage | SubstageNode;
  open: boolean;
  handleModal: (option: keyof OptionModal, value: boolean) => void;
}

export function CreateSubStageModal({ item, open, handleModal }: Props) {
  const [form, setForm] = useState<CreateSubStageRequest>(
    InitialCreateProcessForm,
  );
  const router = useRouter();

  const handleProcess = (value: any, option: keyof CreateSubStageRequest) => {
    setForm((prev) => ({ ...prev, [option]: value }));
  };

  const cleanForm = () => {
    setForm(InitialCreateProcessForm);
  };

  const handleClose = () => {
    cleanForm();
    handleModal("createSubStage", false);
  };

  const handleCreateSubStage = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    try {
      if (!form.name || form.name.length <= 1)
        throw new Error("Ingrese el nombre.");

      if (!form.description || form.description.length <= 1)
        throw new Error("Ingrese la descripción.");

      const data: CreateSubStageRequest = {
        name: form.name,
        description: form.description,
        parentSubstageId: isSubstageNode(item) ? item.id : undefined,
      };

      const stageId = isSubstageNode(item) ? item.stageId : item.id;

      const response = await createSubStage(data, stageId);

      if (!response.success) throw new Error(response.error);

      toast.success(response.message!);
      handleClose();
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }
      toast.error("Hubo un error desconocido al generar la invitación.");
      return;
    }
  };

  return (
    <CustomModal
      open={open}
      title="Crear Sub-Etapa"
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
            form="create-substage-form"
            className="cursor-pointer rounded-md bg-black px-4 py-2 text-sm text-white"
          >
            Crear
          </button>
        </>
      }
    >
      <form
        id="create-substage-form"
        className="space-y-4"
        onSubmit={handleCreateSubStage}
      >
        <CustomInput
          id={"name"}
          type={"text"}
          label={"Nombre"}
          placeholder={"Ingrese el nombre"}
          value={form.name}
          setValue={(value: any) => handleProcess(value, "name")}
          required
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sm text-gray-900">
            Descripción
          </label>
          <textarea
            id="description"
            placeholder="Ingrese la descripción"
            value={form.description}
            onChange={(e) => handleProcess(e.target.value, "description")}
            required
            rows={4}
            className="w-full rounded-lg border border-pborder p-2 text-black/80
                shadow-sm focus:outline-none focus:ring-2 focus:ring-pblue
                resize-none"
          />
        </div>
      </form>
    </CustomModal>
  );
}
