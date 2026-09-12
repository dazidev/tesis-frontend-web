"use client";
import { getStage, getSubStage } from "@/actions";
import { CustomModal } from "@/components/common/modal/CustomModal";
import { ProcessStageResponse, ProcessSubstageResponse } from "@/interfaces";
import { useEffect, useState } from "react";
import { OptionModal } from "../ProcessMapView";

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

  useEffect(() => {
    if (!open || !id) return;
    const getData = async () => {
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
    };

    getData();
  }, [id, type, open]);

  if (!open) return null;
  return (
    <>
      <CustomModal
        open={true}
        title={error ? "Hubo un error" : `${data?.name}`}
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
        <div>{error}</div>
      </CustomModal>
    </>
  );
};
