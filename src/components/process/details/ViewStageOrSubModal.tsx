"use client";
import { getStage, getSubStage } from "@/actions";
import { CustomModal } from "@/components/common/modal/CustomModal";
import {
  ProcessStage,
  ProcessStageResponse,
  ProcessSubstageResponse,
  SubstageNode,
} from "@/interfaces";
import { useEffect, useState } from "react";
import { OptionModal } from "../ProcessMapView";
import {
  statusStyles,
  stageStatusNames,
} from "../../../infrastructure/utils/status";
import { LoadingScreen } from "@/components/common";
import { FolderContainer } from "./FolderContainer";
import { CreateFolderModal } from "./file/CreateFolderModal";
import { FaPlus } from "react-icons/fa6";

interface Props {
  item: ProcessStage | SubstageNode;
  type: "stage" | "substage";
  open: boolean;
  onClose: (option: keyof OptionModal, value: boolean) => void;
}

export interface OptionModalFolder {
  createFolder: boolean;
  deleteFolder: boolean;
}

export const ViewStageOrSubModal = ({ item, type, open, onClose }: Props) => {
  const [data, setData] = useState<
    ProcessStageResponse | ProcessSubstageResponse
  >();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<OptionModalFolder>({
    createFolder: false,
    deleteFolder: false,
  });

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

    getData();
  }, [item, type, open]);

  const handleModalFolder = (
    option: keyof OptionModalFolder,
    value: boolean,
  ) => {
    setOpenModal((prev) => ({ ...prev, [option]: value }));
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
        <div className="flex flex-col text-gray-900">
          {isLoading && <LoadingScreen />}
          {!isLoading && (
            <div className="flex flex-col gap-2">
              <span className="flex flex-row gap-1 items-center">
                Estado:{" "}
                <p className={`${statusStyles[data?.status!]} px-1 rounded-lg`}>
                  {stageStatusNames[data?.status!]}
                </p>
              </span>
              <div>
                <span>Descripción</span>
                <p className="bg-gray-100 rounded-lg p-2 border-1 border-gray-900">
                  {data?.description}
                </p>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex flex-row items-center justify-between px-2">
                  <span>Archivos</span>
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
                </div>
                <FolderContainer />
              </div>
            </div>
          )}
        </div>
      </CustomModal>
      <CreateFolderModal
        item={item}
        open={openModal.createFolder}
        handleModal={handleModalFolder}
      />
    </>
  );
};
