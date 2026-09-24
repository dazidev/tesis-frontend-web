"use client";

import { useState } from "react";

import toast from "react-hot-toast";

import { useRouter } from "next/navigation";

import {
  CreateDigitalFileRequest,
  DigitalFileResponse,
  FolderResponse,
} from "@/interfaces";

import { CustomModal } from "@/components/common/modal/CustomModal";

import { CustomInput } from "@/components/common";

import { uploadFile } from "@/actions";

const InitialCreateFileForm: CreateDigitalFileRequest = {
  name: "",
  description: "",
};

interface Props {
  item: FolderResponse;

  open: boolean;

  handleModal: (option: "add" | "delete", value: boolean) => void;

  addFile: (file: DigitalFileResponse) => void;
}

export function CreateFileModal({ item, open, handleModal, addFile }: Props) {
  const [form, setForm] = useState<CreateDigitalFileRequest>(
    InitialCreateFileForm,
  );

  const [file, setFile] = useState<File | null>(null);

  const router = useRouter();

  const handleProcess = (
    value: any,
    option: keyof CreateDigitalFileRequest,
  ) => {
    setForm((prev) => ({
      ...prev,
      [option]: value,
    }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      toast.error("El archivo debe ser un PDF.");

      e.target.value = "";

      setFile(null);

      return;
    }

    const maxFileSize = 10 * 1024 * 1024;

    if (selectedFile.size > maxFileSize) {
      toast.error("El archivo no puede superar los 10 MB.");

      e.target.value = "";

      setFile(null);

      return;
    }

    setFile(selectedFile);
  };

  const cleanForm = () => {
    setForm(InitialCreateFileForm);

    setFile(null);
  };

  const handleClose = () => {
    cleanForm();

    handleModal("add", false);
  };

  const handleCreateFile = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!form.name || form.name.length <= 1)
        throw new Error("Ingrese el nombre.");

      if (!form.description || form.description.length <= 1)
        throw new Error("Ingrese la descripción.");

      if (!file) throw new Error("Seleccione un archivo PDF.");

      if (file.type !== "application/pdf")
        throw new Error("El archivo debe ser un PDF.");

      const maxFileSize = 10 * 1024 * 1024;

      if (file.size > maxFileSize)
        throw new Error("El archivo no puede superar los 10 MB.");

      const formData = new FormData();

      formData.append("name", form.name);

      formData.append("description", form.description);

      formData.append("file", file);

      const response = await uploadFile(item.id, formData);

      if (!response.success) throw new Error(response.error);

      toast.success(`${response.message}`);

      addFile(response.data!);

      handleClose();

      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);

        return;
      }

      toast.error("Hubo un error desconocido al subir el archivo.");

      return;
    }
  };

  return (
    <>
      <CustomModal
        open={open}
        title={`Subir archivo`}
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
              form="create-file-form"
              className="cursor-pointer rounded-md bg-black px-4 py-2 text-sm text-white"
            >
              Subir
            </button>
          </>
        }
      >
        <form
          id="create-file-form"
          className="space-y-4"
          onSubmit={handleCreateFile}
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
              className="w-full resize-none rounded-lg border border-pborder p-2 text-black/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-pblue"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="file" className="text-sm text-gray-900">
              Archivo PDF
            </label>

            <input
              id="file"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFile}
              required
              className="w-full cursor-pointer rounded-lg border border-pborder p-2 text-sm text-black/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-pblue"
            />

            <span className="text-xs text-gray-500">
              Solo archivos PDF. Tamaño máximo: 10 MB.
            </span>
          </div>
        </form>
      </CustomModal>
    </>
  );
}
