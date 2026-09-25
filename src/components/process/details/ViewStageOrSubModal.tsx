"use client";
import { getStage, getSubStage, updateTaskCompletion } from "@/actions";
import {
  BasicDigitalFolderResponse,
  FolderResponse,
  ProcessStage,
  ProcessStageResponse,
  ProcessSubstageResponse,
  SubstageNode,
  TaskResponse,
} from "@/interfaces";
import { useEffect, useState } from "react";
import { OptionModal } from "../ProcessMapView";
import { CustomModal } from "@/components/common/modal/CustomModal";
import { ViewGeneral } from "./view/ViewGeneral";
import { ViewFolder } from "./view/ViewFolder";
import { CreateUpdateFolderModal } from "./CreateUpdateFolderModal";
import { DeleteFolderModal } from "./DeleteFolderModal";
import toast from "react-hot-toast";
import { CreateUpdateTaskModal } from "./task/CreateUpdateTaskModal";
import { DeleteTaskModal } from "./task/DeleteTaskModal";
interface Props {
  item: ProcessStage | SubstageNode;
  type: "stage" | "substage";
  open: boolean;
  onClose: (option: keyof OptionModal, value: boolean) => void;
}

export interface OptionModalFolder {
  createFolder: boolean;
  deleteFolder: boolean;
  updateFolder: boolean;
}

type OptionView = "general" | "folder";

export const isProcessStage = (
  data: ProcessStageResponse | ProcessSubstageResponse,
): data is ProcessStageResponse => {
  return "processId" in data;
};

export const ViewStageOrSubModal = ({ item, type, open, onClose }: Props) => {
  const [data, setData] = useState<
    ProcessStageResponse | ProcessSubstageResponse
  >();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<OptionModalFolder>({
    createFolder: false,
    updateFolder: false,
    deleteFolder: false,
  });
  const [view, setView] = useState<OptionView>("general");
  const [target, setTarget] = useState<string>("");
  const [targetFolder, setTargetFolder] =
    useState<BasicDigitalFolderResponse>();
  interface OptionModalTask {
    createTask: boolean;
    updateTask: boolean;
    deleteTask: boolean;
  }
  const [openModalTask, setOpenModalTask] = useState<OptionModalTask>({
    createTask: false,
    updateTask: false,
    deleteTask: false,
  });
  const [targetTask, setTargetTask] = useState<TaskResponse>();

  useEffect(() => {
    if (!open || !item) return;
    const getData = async () => {
      setIsLoading(true);
      if (type === "stage") {
        const response = await getStage(item.id);
        if (!response.success) {
          setError(`${response.message}`);
          return;
        }
        setData(response.data);
      } else if (type === "substage") {
        const response = await getSubStage(item.id);
        if (!response.success) {
          setError(`${response.message}`);
          return;
        }
        setData(response.data);
      }
      setIsLoading(false);
    };

    setView("general");
    getData();
  }, [item, type, open]);

  const handleModalFolder = (
    option: keyof OptionModalFolder,
    value: boolean,
  ) => {
    setOpenModal((prev) => ({ ...prev, [option]: value }));
  };

  const handleModalTask = (option: keyof OptionModalTask, value: boolean) => {
    setOpenModalTask((prev) => ({
      ...prev,
      [option]: value,
    }));
  };

  const handleSetTarget = (id: string) => {
    setTarget(id);
    setView("folder");
  };

  const addFolder = (folder: FolderResponse) => {
    setData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        digitalFolders: [
          ...prev.digitalFolders,
          {
            id: folder.id,
            name: folder.name,
            description: folder.description,
            _count: {
              digitalFiles: 0,
            },
          },
        ],
      };
    });
  };

  const handleUpdateFolderTarget = (folderId: string) => {
    const folder = data?.digitalFolders.find(
      (folder) => folder.id === folderId,
    );

    if (!folder) return;

    setTargetFolder(folder);

    handleModalFolder("updateFolder", true);
  };

  const updateFolderState = (updatedFolder: FolderResponse) => {
    setData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,

        digitalFolders: prev.digitalFolders.map((folder) =>
          folder.id === updatedFolder.id
            ? {
                ...folder,

                name: updatedFolder.name,

                description: updatedFolder.description,
              }
            : folder,
        ),
      };
    });
  };

  const handleDeleteFolderTarget = (folderId: string) => {
    const folder = data?.digitalFolders.find(
      (folder) => folder.id === folderId,
    );

    if (!folder) return;

    setTargetFolder(folder);

    handleModalFolder("deleteFolder", true);
  };

  const removeFolder = (folderId: string) => {
    setData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,

        digitalFolders: prev.digitalFolders.filter(
          (folder) => folder.id !== folderId,
        ),
      };
    });
  };

  const addTask = (task: TaskResponse) => {
    setData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,

        tasks: [...prev.tasks, task].sort(
          (a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
        ),
      };
    });
  };

  const handleTaskCompletion = async (taskId: string, completed: boolean) => {
    try {
      const response = await updateTaskCompletion(taskId, {
        completed,
      });

      if (!response.success) {
        throw new Error(response.error);
      }

      setData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,

          tasks: prev.tasks.map((task) =>
            task.id === taskId ? response.data! : task,
          ),
        };
      });

      toast.success(response.message!);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);

        return;
      }

      toast.error("Hubo un error al actualizar la tarea.");
    }
  };

  const handleUpdateTaskTarget = (taskId: string) => {
    const task = data?.tasks.find((task) => task.id === taskId);

    if (!task) return;

    setTargetTask(task);

    handleModalTask("updateTask", true);
  };

  const updateTaskState = (updatedTask: TaskResponse) => {
    setData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,

        tasks: prev.tasks
          .map((task) => (task.id === updatedTask.id ? updatedTask : task))
          .sort(
            (a, b) =>
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
          ),
      };
    });
  };

  const handleDeleteTaskTarget = (taskId: string) => {
    const task = data?.tasks.find((task) => task.id === taskId);

    if (!task) return;

    setTargetTask(task);

    handleModalTask("deleteTask", true);
  };

  const removeTask = (taskId: string) => {
    setData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,

        tasks: prev.tasks.filter((task) => task.id !== taskId),
      };
    });
  };

  if (!open) return null;
  return (
    <>
      <CustomModal
        open={true}
        title={isLoading ? "Cargando..." : `${data?.name}`}
        onClose={() => onClose("view", false)}
        footer={
          <button
            type="button"
            className="cursor-pointer rounded-md border px-4 py-2 text-sm text-black/80"
            onClick={() => onClose("view", false)}
          >
            Cerrar
          </button>
        }
        width="max-w-2xl"
      >
        {view === "general" ? (
          <ViewGeneral
            data={data!}
            isLoading={isLoading}
            handleModalFolder={handleModalFolder}
            setTarget={handleSetTarget}
            updateTarget={handleUpdateFolderTarget}
            deleteTarget={handleDeleteFolderTarget}
            handleCreateTask={() => handleModalTask("createTask", true)}
            updateTaskCompletion={handleTaskCompletion}
            updateTaskTarget={handleUpdateTaskTarget}
            deleteTaskTarget={handleDeleteTaskTarget}
          />
        ) : (
          <ViewFolder id={target} setView={setView} />
        )}
      </CustomModal>
      {openModal.createFolder && (
        <CreateUpdateFolderModal
          type="create"
          item={item}
          open={openModal.createFolder}
          handleModal={handleModalFolder}
          addFolder={addFolder}
          updateFolderState={updateFolderState}
        />
      )}
      {openModal.updateFolder && targetFolder && (
        <CreateUpdateFolderModal
          type="update"
          item={item}
          targetFolder={targetFolder}
          open={openModal.updateFolder}
          handleModal={handleModalFolder}
          addFolder={addFolder}
          updateFolderState={updateFolderState}
        />
      )}
      {openModal.deleteFolder && targetFolder && (
        <DeleteFolderModal
          folder={targetFolder}
          open={openModal.deleteFolder}
          handleModal={handleModalFolder}
          removeFolder={removeFolder}
        />
      )}
      {openModalTask.createTask && (
        <CreateUpdateTaskModal
          type="create"
          item={item}
          open={openModalTask.createTask}
          close={() => handleModalTask("createTask", false)}
          addTask={addTask}
          updateTaskState={updateTaskState}
        />
      )}
      {openModalTask.updateTask && targetTask && (
        <CreateUpdateTaskModal
          type="update"
          item={item}
          targetTask={targetTask}
          open={openModalTask.updateTask}
          close={() => {
            handleModalTask("updateTask", false);

            setTargetTask(undefined);
          }}
          addTask={addTask}
          updateTaskState={updateTaskState}
        />
      )}
      {openModalTask.deleteTask && targetTask && (
        <DeleteTaskModal
          task={targetTask}
          open={openModalTask.deleteTask}
          close={() => {
            handleModalTask("deleteTask", false);

            setTargetTask(undefined);
          }}
          removeTask={removeTask}
        />
      )}
    </>
  );
};
