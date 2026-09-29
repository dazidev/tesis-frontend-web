import { LoadingScreen } from "@/components/common";
import { stageStatusNames, statusStyles } from "@/infrastructure";
import { FolderContainer } from "../FolderContainer";
import { OptionModalFolder } from "../ViewStageOrSubModal";
import { ProcessStageResponse, ProcessSubstageResponse } from "@/interfaces";
import { FaPlus } from "react-icons/fa6";
import { TaskContainer } from "../task/TaskContainer";

interface Props {
  data: ProcessStageResponse | ProcessSubstageResponse;
  type: "stage" | "substage";
  editable: boolean;
  isLoading: boolean;
  handleModalFolder: (option: keyof OptionModalFolder, value: boolean) => void;
  setTarget: (id: string) => void;
  updateTarget: (id: string) => void;
  deleteTarget: (id: string) => void;
  handleCreateTask: () => void;
  updateTaskCompletion: (id: string, completed: boolean) => void;
  updateTaskTarget: (id: string) => void;
  deleteTaskTarget: (id: string) => void;
  handleCloseStatus: () => void;
}

export const ViewGeneral = ({
  data,
  type,
  editable,
  isLoading,
  handleModalFolder,
  setTarget,
  updateTarget,
  deleteTarget,
  handleCreateTask,
  updateTaskCompletion,
  updateTaskTarget,
  deleteTaskTarget,
  handleCloseStatus,
}: Props) => {
  return (
    <div className="flex flex-col text-gray-900">
      {isLoading && <LoadingScreen />}
      {!isLoading && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center justify-between">
            <span className="flex flex-row items-center gap-1">
              Estado:{" "}
              <p className={`${statusStyles[data.status]} rounded-lg px-1`}>
                {stageStatusNames[data.status]}
              </p>
            </span>
            {data.status === "opened" && (
              <button
                type="button"
                className="
                  cursor-pointer rounded-md
                  border border-blue-300
                  bg-blue-50
                  px-3 py-1
                  text-sm text-blue-700
                  transition-colors duration-200
                  hover:bg-blue-100
                  hover:text-blue-900
                "
                onClick={handleCloseStatus}
              >
                {type === "stage" ? "Cerrar etapa" : "Cerrar subetapa"}
              </button>
            )}
          </div>
          <div>
            <span className="px-2">Descripción</span>
            <p className="bg-gray-100 rounded-lg p-2 border-1 border-gray-900">
              {data?.description}
            </p>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex flex-row items-center justify-between px-2">
              <span>Carpetas digitales ({data?.digitalFolders.length})</span>
              {editable && (
                <button
                  type="button"
                  aria-label={`Agregar etapa intermedia`}
                  title="Agregar etapa intermedia"
                  className="
                      flex h-7 w-7 items-center justify-center rounded-md
                      border border-green-300
                      bg-green-50 text-green-700
                      cursor-pointer
                      transition-colors duration-200
                      hover:bg-green-100 hover:text-green-900 focus:outline-none
                      disabled:cursor-not-allowed disabled:opacity-50
                    "
                  onClick={() => handleModalFolder("createFolder", true)}
                >
                  <FaPlus className="h-4 w-4" />
                </button>
              )}
            </div>
            {data?.digitalFolders.length > 0 && (
              <FolderContainer
                data={data.digitalFolders}
                editable={editable}
                setTarget={setTarget}
                updateTarget={updateTarget}
                deleteTarget={deleteTarget}
              />
            )}
          </div>
          <div className="mt-2 flex flex-col gap-2">
            <div className="flex flex-row items-center justify-between px-2">
              <span>Tareas ({data?.tasks?.length ?? 0})</span>
              {editable && (
                <button
                  type="button"
                  aria-label="Agregar tarea"
                  title="Agregar tarea"
                  className="
                  flex h-7 w-7 items-center justify-center rounded-md
                  border border-green-300
                  bg-green-50 text-green-700
                  cursor-pointer
                  transition-colors duration-200
                  hover:bg-green-100 hover:text-green-900 focus:outline-none
                  disabled:cursor-not-allowed disabled:opacity-50
                "
                  onClick={handleCreateTask}
                >
                  <FaPlus className="h-4 w-4" />
                </button>
              )}
            </div>

            {data.tasks && data.tasks.length > 0 && (
              <TaskContainer
                data={data.tasks}
                editable={editable}
                updateCompletion={updateTaskCompletion}
                updateTarget={updateTaskTarget}
                deleteTarget={deleteTaskTarget}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
