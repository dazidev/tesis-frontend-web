import { TaskResponse } from "@/interfaces";
import { TaskItem } from "./TaskItem";

interface Props {
  data: TaskResponse[];
}

export const TaskContainer = ({ data }: Props) => {
  return (
    <div className="flex flex-col gap-2 rounded-lg border-1 bg-gray-100 p-2">
      {data.map((task) => (
        <TaskItem key={task.id} item={task} />
      ))}
    </div>
  );
};
