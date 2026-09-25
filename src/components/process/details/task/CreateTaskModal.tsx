"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  CreateTaskRequest,
  ProcessStage,
  SubstageNode,
  TaskResponse,
} from "@/interfaces";
import { CustomModal } from "@/components/common/modal/CustomModal";
import { createTask } from "@/actions";
import { isSubstageNode } from "@/components/common/modal/processes/CreateSubStageModal";
interface Props {
  item: ProcessStage | SubstageNode;

  open: boolean;

  close: () => void;

  addTask: (task: TaskResponse) => void;
}

interface CreateTaskForm {
  description: string;
  dueDate: string;
}

const InitialCreateTaskForm: CreateTaskForm = {
  description: "",
  dueDate: "",
};

export function CreateTaskModal({ item, open, close, addTask }: Props) {
  const [form, setForm] = useState<CreateTaskForm>(InitialCreateTaskForm);

  const handleProcess = (value: string, option: keyof CreateTaskForm) => {
    setForm((prev) => ({
      ...prev,
      [option]: value,
    }));
  };

  const cleanForm = () => {
    setForm(InitialCreateTaskForm);
  };

  const handleClose = () => {
    cleanForm();

    close();
  };

  const handleCreateTask = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!form.description || form.description.length <= 1) {
        throw new Error("Ingrese la descripción de la tarea.");
      }

      if (!form.dueDate) {
        throw new Error("Ingrese la fecha límite.");
      }

      const selectedDate = new Date(form.dueDate);

      if (selectedDate.getTime() <= Date.now()) {
        throw new Error(
          "La fecha límite debe ser posterior a la fecha actual.",
        );
      }

      const data: CreateTaskRequest = {
        description: form.description,

        dueDate: selectedDate.toISOString(),

        substageId: isSubstageNode(item) ? item.id : undefined,
      };

      const stageId = isSubstageNode(item) ? item.stageId : item.id;

      const response = await createTask(stageId, data);

      if (!response.success) {
        throw new Error(response.error);
      }

      toast.success(response.message!);

      addTask(response.data!);

      handleClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);

        return;
      }

      toast.error("Hubo un error desconocido al crear la tarea.");
    }
  };

  return (
    <>
      {open && (
        <CustomModal
          open={open}
          title="Crear tarea"
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
                form="create-task-form"
                className="cursor-pointer rounded-md bg-black px-4 py-2 text-sm text-white"
              >
                Crear
              </button>
            </>
          }
        >
          <form
            id="create-task-form"
            className="space-y-4"
            onSubmit={handleCreateTask}
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="description" className="text-sm text-gray-900">
                Descripción
              </label>

              <textarea
                id="description"
                placeholder="Ingrese la descripción de la tarea"
                value={form.description}
                onChange={(e) => handleProcess(e.target.value, "description")}
                required
                rows={4}
                className="w-full resize-none rounded-lg border border-pborder p-2 text-black/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-pblue"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="dueDate" className="text-sm text-gray-900">
                Fecha límite
              </label>

              <input
                id="dueDate"
                type="datetime-local"
                value={form.dueDate}
                onChange={(e) => handleProcess(e.target.value, "dueDate")}
                required
                className="w-full rounded-lg border border-pborder p-2 text-black/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-pblue"
              />
            </div>
          </form>
        </CustomModal>
      )}
    </>
  );
}
