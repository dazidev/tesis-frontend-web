"use client";
import { getStage, getSubStage } from "@/actions";
import { CustomModal } from "@/components/common/modal/CustomModal";
import { ProcessStageResponse, ProcessSubstageResponse } from "@/interfaces";
import { useEffect, useState } from "react";
import { OptionModal } from "../ProcessMapView";
import {
  statusStyles,
  stageStatusNames,
} from "../../../infrastructure/utils/status";
import { LoadingScreen } from "@/components/common";
import { FolderContainer } from "./FolderContainer";

interface Props {
  id: string;
  type: "stage" | "substage";
  open: boolean;
  onClose: (option: keyof OptionModal, value: boolean) => void;
}

export const ViewStageOrSubModal = ({ id, type, open, onClose }: Props) => {
  const [data, setData] = useState<
    ProcessStageResponse | ProcessSubstageResponse
  >();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!open || !id) return;
    const getData = async () => {
      setIsLoading(true);
      if (type === "stage") {
        const response = await getStage(id);
        if (!response.success) {
          setError(`${response.message}`);
          return;
        }
        setData(response.data);
      } else if (type === "substage") {
        const response = await getSubStage(id);
        if (!response.success) {
          setError(`${response.message}`);
          return;
        }
        setData(response.data);
      }
      setIsLoading(false);
    };

    getData();
  }, [id, type, open]);

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
              <FolderContainer />
            </div>
          )}
        </div>
      </CustomModal>
    </>
  );
};
