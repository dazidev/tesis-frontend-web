import { LoadingScreen } from "@/components/common";
import { stageStatusNames, statusStyles } from "@/infrastructure";
import { FolderContainer } from "../FolderContainer";
import { OptionModalFolder } from "../ViewStageOrSubModal";
import { ProcessStageResponse, ProcessSubstageResponse } from "@/interfaces";
import { FaPlus } from "react-icons/fa6";

interface Props {
  data: ProcessStageResponse | ProcessSubstageResponse;
  isLoading: boolean;
  handleModalFolder: (option: keyof OptionModalFolder, value: boolean) => void;
  setTarget: (id: string) => void;
  updateTarget: (id: string) => void;
  deleteTarget: (id: string) => void;
}

export const ViewGeneral = ({
  data,
  isLoading,
  handleModalFolder,
  setTarget,
  updateTarget,
  deleteTarget,
}: Props) => {
  return (
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
            <span className="px-2">Descripción</span>
            <p className="bg-gray-100 rounded-lg p-2 border-1 border-gray-900">
              {data?.description}
            </p>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex flex-row items-center justify-between px-2">
              <span>Carpetas digitales ({data?.digitalFolders.length})</span>
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
            {data?.digitalFolders.length > 0 && (
              <FolderContainer
                data={data.digitalFolders}
                setTarget={setTarget}
                updateTarget={updateTarget}
                deleteTarget={deleteTarget}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
