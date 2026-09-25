import { TaskResponse } from "@/interfaces";
import { TaskItem } from "./TaskItem";

interface Props {
  data: TaskResponse[];
  updateCompletion: (id: string, completed: boolean) => void;
  updateTarget: (id: string) => void;
  deleteTarget: (id: string) => void;
}

export const TaskContainer = ({
  data,
  updateCompletion,
  updateTarget,
  deleteTarget,
}: Props) => {
  return (
    <div className="flex flex-col gap-2 rounded-lg border-1 bg-gray-100 p-2">
      {data.map((task) => (
        <TaskItem
          key={task.id}
          item={task}
          updateCompletion={updateCompletion}
          updateTarget={updateTarget}
          deleteTarget={deleteTarget}
        />
      ))}
    </div>
  );
};
