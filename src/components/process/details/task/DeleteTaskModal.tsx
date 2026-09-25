"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { TaskDeactivationRequest, TaskResponse } from "@/interfaces";
import { CustomInput } from "@/components/common";
import { CustomModal } from "@/components/common/modal/CustomModal";
import { deactivateTask } from "@/actions";

interface DeleteTaskForm {
  reason: string;
}

const InitialDeleteTaskForm: DeleteTaskForm = {
  reason: "",
};

interface Props {
  task: TaskResponse;

  open: boolean;

  close: () => void;

  removeTask: (id: string) => void;
}

export function DeleteTaskModal({ task, open, close, removeTask }: Props) {
  const [form, setForm] = useState<DeleteTaskForm>(InitialDeleteTaskForm);

  const handleReason = (value: string) => {
    setForm((prev) => ({
      ...prev,
      reason: value,
    }));
  };

  const cleanForm = () => {
    setForm(InitialDeleteTaskForm);
  };

  const handleClose = () => {
    cleanForm();

    close();
  };

  const handleDeleteTask = async (e: React.SubmitEvent<HTMLFormElement>) => {
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

      const data: TaskDeactivationRequest = {
        reason: form.reason,
      };

      const response = await deactivateTask(task.id, data);

      if (!response.success) {
        throw new Error(response.error);
      }

      toast.success(response.message!);

      removeTask(task.id);

      handleClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);

        return;
      }

      toast.error("Hubo un error desconocido al eliminar la tarea.");
    }
  };

  const dueDate = new Date(task.dueDate).toLocaleString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      {open && (
        <CustomModal
          open={open}
          title="Eliminar tarea"
          onClose={handleClose}
          footer={
            <>
              <button
                type="button"
                className="cursor-pointer rounded-md border px-4 py-2 text-sm text-black/80"
                onClick={handleClose}
              >
                Cancelar
              </button>

              <button
                type="submit"
                form="delete-task-form"
                className="cursor-pointer rounded-md bg-red-500 px-4 py-2 text-sm text-white"
              >
                Eliminar
              </button>
            </>
          }
        >
          <form
            id="delete-task-form"
            className="space-y-4"
            onSubmit={handleDeleteTask}
          >
            <div>
              <p className="text-black">La tarea que va a eliminar:</p>

              <div className="pl-2 text-black">
                <p>
                  Descripción:{" "}
                  <span className="font-bold">{task.description}</span>
                </p>

                <p>
                  Fecha límite: <span className="font-bold">{dueDate}</span>
                </p>
              </div>
            </div>

            <CustomInput
              id="reason"
              type="text"
              label="Razón"
              placeholder="Ingrese la razón"
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
