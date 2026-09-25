"use client";
import { getStage, getSubStage } from "@/actions";
import {
  BasicDigitalFolderResponse,
  FolderResponse,
  ProcessStage,
  ProcessStageResponse,
  ProcessSubstageResponse,
  SubstageNode,
} from "@/interfaces";
import { useEffect, useState } from "react";
import { OptionModal } from "../ProcessMapView";
import { CustomModal } from "@/components/common/modal/CustomModal";
import { ViewGeneral } from "./view/ViewGeneral";
import { ViewFolder } from "./view/ViewFolder";
import { CreateUpdateFolderModal } from "./CreateUpdateFolderModal";
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
    deleteFolder: false,
    updateFolder: false,
  });
  const [view, setView] = useState<OptionView>("general");
  const [target, setTarget] = useState<string>("");
  const [targetFolder, setTargetFolder] =
    useState<BasicDigitalFolderResponse>();

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
    </>
  );
};
