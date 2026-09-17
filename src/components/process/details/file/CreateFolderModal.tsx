"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  CreateFolderRequest,
  FolderResponse,
  ProcessStage,
  SubstageNode,
} from "@/interfaces";
import { CustomModal } from "@/components/common/modal/CustomModal";
import { CustomInput } from "@/components/common";
import { OptionModalFolder } from "../ViewStageOrSubModal";
import { createFolder } from "@/actions";
import { isSubstageNode } from "@/components/common/modal/processes/CreateSubStageModal";

const InitialCreateFolderForm: CreateFolderRequest = {
  name: "",
  description: "",
  substageId: undefined,
};

interface Props {
  item: ProcessStage | SubstageNode;
  open: boolean;
  handleModal: (option: keyof OptionModalFolder, value: boolean) => void;
  addFolder: (folder: FolderResponse) => void;
}

export function CreateFolderModal({
  item,
  open,
  handleModal,
  addFolder,
}: Props) {
  const [form, setForm] = useState<CreateFolderRequest>(
    InitialCreateFolderForm,
  );
  const router = useRouter();

  const handleProcess = (value: any, option: keyof CreateFolderRequest) => {
    setForm((prev) => ({ ...prev, [option]: value }));
  };

  const cleanForm = () => {
    setForm(InitialCreateFolderForm);
  };

  const handleClose = () => {
    cleanForm();
    handleModal("createFolder", false);
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

      const data: CreateFolderRequest = {
        name: form.name,
        description: form.description,
        substageId: isSubstageNode(item) ? item.id : undefined,
      };

      const response = isSubstageNode(item)
        ? await createFolder(data, item.stageId)
        : await createFolder(data, item.id);

      if (!response.success) throw new Error(response.error);
      toast.success(`${response.message}`);
      addFolder(response.data!);

      handleClose();
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }
      toast.error("Hubo un error desconocido al crear el folder.");
      return;
    }
  };

  return (
    <>
      <CustomModal
        open={open}
        title={`Crear Folder`}
        onClose={() => handleClose()}
        width="max-w-sm"
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
    </>
  );
}
