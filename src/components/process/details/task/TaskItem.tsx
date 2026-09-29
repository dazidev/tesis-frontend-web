import { TaskResponse } from "@/interfaces";
import { FaPen, FaTrash } from "react-icons/fa6";

interface Props {
  item: TaskResponse;
  editable: boolean;
  updateCompletion: (id: string, completed: boolean) => void;
  updateTarget: (id: string) => void;
  deleteTarget: (id: string) => void;
}

export const TaskItem = ({
  item,
  editable,
  updateCompletion,
  updateTarget,
  deleteTarget,
}: Props) => {
  const dueDate = new Date(item.dueDate);

  const formattedDate = dueDate.toLocaleString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const completed = item.completedAt !== null;

  return (
    <div className="flex flex-row items-center justify-between rounded-sm border-1 bg-gray-200 p-2">
      <div className="flex flex-row items-center gap-3">
        <input
          type="checkbox"
          checked={completed}
          disabled={!editable}
          onChange={(e) => updateCompletion(item.id, e.target.checked)}
          className="h-4 w-4 cursor-pointer disabled:cursor-not-allowed"
        />

        <div className="flex flex-col">
          <span
            className={`text-base ${
              completed ? "text-gray-500 line-through" : "text-gray-900"
            }`}
          >
            {item.description}
          </span>

          <span className="text-sm text-gray-500">Vence: {formattedDate}</span>
        </div>
      </div>
      <div className="flex flex-row gap-1">
        {editable && (
          <>
            <button
              type="button"
              aria-label="Editar tarea"
              title="Editar tarea"
              className="
                flex h-8 w-8 items-center justify-center rounded-md
                border border-gray-400
                bg-gray-50 text-gray-700
                cursor-pointer
                transition-colors duration-200
                hover:bg-gray-100 hover:text-gray-900 focus:outline-none
                disabled:cursor-not-allowed disabled:opacity-50
              "
              onClick={() => updateTarget(item.id)}
            >
              <FaPen className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Eliminar tarea"
              title="Eliminar tarea"
              className="
                flex h-8 w-8 items-center justify-center rounded-md
                border border-red-300
                bg-red-100 text-red-600
                cursor-pointer
                transition-colors duration-200
                hover:bg-red-200 hover:text-red-700 focus:outline-none
                disabled:cursor-not-allowed disabled:opacity-50
              "
              onClick={() => deleteTarget(item.id)}
            >
              <FaTrash className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
