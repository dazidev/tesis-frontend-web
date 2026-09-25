"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  CreateTaskRequest,
  ProcessStage,
  SubstageNode,
  TaskResponse,
  UpdateTaskRequest,
} from "@/interfaces";
import { CustomModal } from "@/components/common/modal/CustomModal";
import { createTask, updateTask } from "@/actions";
import { isSubstageNode } from "@/components/common/modal/processes/CreateSubStageModal";

interface Props {
  item: ProcessStage | SubstageNode;

  targetTask?: TaskResponse;

  type: "create" | "update";

  open: boolean;

  close: () => void;

  addTask: (task: TaskResponse) => void;

  updateTaskState: (task: TaskResponse) => void;
}

interface TaskForm {
  description: string;
  dueDate: string;
}

const InitialTaskForm: TaskForm = {
  description: "",
  dueDate: "",
};

//! todo: move this helper
const getDateTimeLocalValue = (value: string) => {
  const date = new Date(value);

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  return localDate.toISOString().slice(0, 16);
};

export function CreateUpdateTaskModal({
  item,
  targetTask,
  type,
  open,
  close,
  addTask,
  updateTaskState,
}: Props) {
  const [form, setForm] = useState<TaskForm>(InitialTaskForm);

  useEffect(() => {
    if (type === "update" && targetTask) {
      setForm({
        description: targetTask.description,

        dueDate: getDateTimeLocalValue(targetTask.dueDate),
      });

      return;
    }

    setForm(InitialTaskForm);
  }, [type, targetTask]);

  const handleProcess = (value: string, option: keyof TaskForm) => {
    setForm((prev) => ({
      ...prev,
      [option]: value,
    }));
  };

  const cleanForm = () => {
    setForm(InitialTaskForm);
  };

  const handleClose = () => {
    cleanForm();

    close();
  };

  const handleCreateUpdateTask = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    try {
      if (!form.description || form.description.length <= 1) {
        throw new Error("Ingrese la descripción de la tarea.");
      }

      if (!form.dueDate) {
        throw new Error("Ingrese la fecha límite.");
      }

      const selectedDate = new Date(form.dueDate);

      if (type === "create") {
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
      }

      if (type === "update") {
        if (!targetTask) {
          throw new Error("Tarea no encontrada.");
        }

        const data: UpdateTaskRequest = {
          description: form.description,

          dueDate: selectedDate.toISOString(),
        };

        const response = await updateTask(targetTask.id, data);

        if (!response.success) {
          throw new Error(response.error);
        }

        toast.success(response.message!);

        updateTaskState(response.data!);
      }

      handleClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);

        return;
      }

      toast.error(
        `Hubo un error desconocido al ${
          type === "create" ? "crear" : "actualizar"
        } la tarea.`,
      );
    }
  };

  return (
    <>
      {open && (
        <CustomModal
          open={open}
          title={type === "create" ? "Crear tarea" : "Editar tarea"}
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
                form="create-update-task-form"
                className="cursor-pointer rounded-md bg-black px-4 py-2 text-sm text-white"
              >
                {type === "create" ? "Crear" : "Actualizar"}
              </button>
            </>
          }
        >
          <form
            id="create-update-task-form"
            className="space-y-4"
            onSubmit={handleCreateUpdateTask}
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
