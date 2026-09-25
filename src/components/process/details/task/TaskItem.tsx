import { TaskResponse } from "@/interfaces";

interface Props {
  item: TaskResponse;
}

export const TaskItem = ({ item }: Props) => {
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
          readOnly
          className="h-4 w-4"
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
    </div>
  );
};
