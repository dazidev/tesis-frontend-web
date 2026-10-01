"use client";
import {
  closeStage,
  closeSubStage,
  getStage,
  getSubStage,
  updateTaskCompletion,
} from "@/actions";
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
import { LoadingScreen } from "@/components/common";
import { useRouter } from "next/navigation";
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
  const editable = data?.status === "opened";
  const router = useRouter();

  useEffect(() => {
    if (!open || !item) return;

    let cancelled = false;

    const getData = async () => {
      setIsLoading(true);
      setError("");
      setData(undefined);
      setView("general");

      try {
        const response =
          type === "stage"
            ? await getStage(item.id)
            : await getSubStage(item.id);

        if (cancelled) return;

        if (!response.success || !response.data) {
          setError(
            response.error ??
              `No fue posible cargar la ${
                type === "stage" ? "etapa" : "subetapa"
              }.`,
          );

          return;
        }

        setData(response.data);
      } catch (error: unknown) {
        if (cancelled) return;

        if (error instanceof Error) {
          setError(error.message);
          return;
        }

        setError(
          `Hubo un problema al cargar la ${
            type === "stage" ? "etapa" : "subetapa"
          }.`,
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void getData();

    return () => {
      cancelled = true;
    };
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
    if (!editable) return;

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
    if (!editable) return;

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
    if (!editable) return;
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
    if (!editable) return;

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
    if (!editable) return;

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

  const handleCloseStatus = async () => {
    if (!data) return;

    try {
      const response =
        type === "stage"
          ? await closeStage(data.id)
          : await closeSubStage(data.id);

      if (!response.success) {
        throw new Error(response.error);
      }

      setData((prev) => {
        if (!prev) return prev;

        if (isProcessStage(prev)) {
          return {
            ...prev,
            status: "closed",
            openSubstages: 0,
          };
        }

        return {
          ...prev,
          status: "closed",
        };
      });

      toast.success(response.message!);
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }

      toast.error(
        `Hubo un problema al cerrar la ${
          type === "stage" ? "etapa" : "subetapa"
        }.`,
      );
    }
  };

  if (!open) return null;
  return (
    <>
      <CustomModal
        open={true}
        title={
          isLoading
            ? "Cargando..."
            : error
              ? "Error al cargar"
              : (data?.name ?? (type === "stage" ? "Etapa" : "Subetapa"))
        }
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
          <>
            {isLoading && <LoadingScreen />}
            {!isLoading && error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {data && !isLoading && !error && (
              <ViewGeneral
                data={data}
                editable={editable}
                type={type}
                handleModalFolder={handleModalFolder}
                setTarget={handleSetTarget}
                updateTarget={handleUpdateFolderTarget}
                deleteTarget={handleDeleteFolderTarget}
                handleCreateTask={() => handleModalTask("createTask", true)}
                updateTaskCompletion={handleTaskCompletion}
                updateTaskTarget={handleUpdateTaskTarget}
                deleteTaskTarget={handleDeleteTaskTarget}
                handleCloseStatus={handleCloseStatus}
              />
            )}
          </>
        ) : (
          <ViewFolder id={target} setView={setView} editable={editable} />
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
