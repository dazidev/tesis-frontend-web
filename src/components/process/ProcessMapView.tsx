"use client";
import { ProcessStage, ProcessStatus, SubstageNode } from "@/interfaces";
import { useState } from "react";
import {
  FaEye,
  FaLongArrowAltRight,
  FaChevronDown,
  FaChevronRight,
  FaTrash,
  FaCheck,
} from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { CreateSubStageModal, DeactivateSubStageModal } from "../common";
import { SubstageTree } from "./tree/SubStageTree";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { ViewStageOrSubModal } from "./details/ViewStageOrSubModal";
import { advanceStage, finalizeProcess } from "@/actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export type ProcessMapViewProps = {
  stages: ProcessStage[];
  processStatus: ProcessStatus;
};

export interface OptionModal {
  createStage: boolean;
  view: boolean;
  createSubStage: boolean;
  deactivateSubStage: boolean;
}

export type ViewType = "stage" | "substage";

const stageStatusConfig: Record<
  ProcessStage["status"],
  {
    label: string;
    container: string;
    badge: string;
  }
> = {
  opened: {
    label: "En curso",
    container: "bg-blue-50 border-blue-500 ring-1 ring-blue-200 shadow-sm",
    badge: "bg-blue-100 text-blue-700 border border-blue-200",
  },

  closed: {
    label: "Cerrada",
    container: "bg-green-50 border-green-500",
    badge: "bg-green-100 text-green-700 border border-green-200",
  },

  created: {
    label: "Pendiente",
    container: "bg-gray-100 border-gray-400",
    badge: "bg-gray-200 text-gray-600 border border-gray-300",
  },
};

export default function ProcessMapView({
  stages,
  processStatus,
}: ProcessMapViewProps) {
  const [target, setTarget] = useState<ProcessStage | SubstageNode>();
  const [open, setOpen] = useState<OptionModal>({
    createStage: false,
    view: false,
    createSubStage: false,
    deactivateSubStage: false,
  });
  const [viewType, setViewType] = useState<ViewType>("stage");
  const [showOptionsId, setShowOptionsId] = useState<string | null>(null);
  const router = useRouter();

  const handleModal = (option: keyof OptionModal, value: boolean) => {
    setOpen((prev) => ({ ...prev, [option]: value }));
  };

  const handleView = (stage: ProcessStage | SubstageNode, type: ViewType) => {
    setTarget(stage);
    setViewType(type);
    handleModal("view", true);
  };

  const handleCreateSubStage = (
    stage: ProcessStage | SubstageNode,
    option: "Stage" | "SubStage",
  ) => {
    setTarget(stage);
    handleModal(`create${option}`, true);
  };

  const handleDeactivateSubStage = (stage: ProcessStage | SubstageNode) => {
    setTarget(stage);
    handleModal("deactivateSubStage", true);
  };

  const handleShowOptions = (stageId: string) => {
    setShowOptionsId((prev) => (prev === stageId ? null : stageId));
  };

  const handleAdvanceStage = async (stage: ProcessStage) => {
    try {
      const response = await advanceStage(stage.id);

      if (!response.success) {
        throw new Error(response.error);
      }

      toast.success(response.message!);

      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }

      toast.error("Hubo un problema al avanzar a la siguiente etapa.");
    }
  };

  const handleFinalizeProcess = async (stage: ProcessStage) => {
    try {
      const response = await finalizeProcess(stage.id);

      if (!response.success) {
        throw new Error(response.error);
      }

      toast.success(response.message!);

      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }

      toast.error("Hubo un problema al finalizar el proceso.");
    }
  };

  return (
    <div className="w-full h-full py-8 px-6">
      <div className="flex justify-end mb-5">
        <div
          className="
          flex items-center gap-5
          rounded-md
          border border-gray-200
          bg-gray-50
          px-4 py-2
          text-xs
          text-gray-600
        "
        >
          <span className="font-semibold text-gray-700">Estados:</span>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-blue-500" />
            <span>En curso</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-green-500" />
            <span>Cerrada</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-gray-400" />
            <span>Pendiente</span>
          </div>
        </div>
      </div>

      <div className="flex min-h-full overflow-x-auto">
        <div className="flex flex-row items-start justify-start gap-4 max-w-6xl mx-auto w-max min-w-full">
          {stages.map((stage, i) => {
            const editable = stage.status === "opened";
            const statusConfig = stageStatusConfig[stage.status];
            const nextStage = stages[i + 1];
            const processIsOpened = processStatus === "opened";
            const canAdvance =
              processIsOpened &&
              stage.status === "closed" &&
              nextStage?.status === "created";
            const canCreateIntermediate =
              processIsOpened &&
              stage.status === "closed" &&
              (!nextStage || nextStage.status === "created");
            const canFinalize =
              processIsOpened && stage.status === "closed" && !nextStage;

            return (
              <div key={stage.id} className="flex flex-row gap-4 items-start">
                <div className="flex flex-col">
                  <div
                    className={`
                      flex items-center justify-between rounded-md border px-3 py-4 gap-3 min-w-[450px] text-center transition-all duration-200
                      ${statusConfig.container}
                    `}
                  >
                    <p className="text-2md leading-snug text-gray-900 font-bold w-full">
                      {stage.name}
                    </p>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusConfig.badge}`}
                    >
                      {statusConfig.label}
                    </span>

                    <div className="flex flex-row gap-2 shrink-0">
                      <button
                        type="button"
                        aria-label={`Ver opciones`}
                        title="Ver opciones"
                        className="
                          flex h-8 w-8 items-center justify-center rounded-md
                          border border-gray-300
                        bg-gray-100 text-gray-500
                          cursor-pointer
                          transition-colors duration-200
                        hover:bg-gray-50 hover:text-gray-600 focus:outline-none
                          disabled:cursor-not-allowed disabled:opacity-50
                        "
                        onClick={() => handleShowOptions(stage.id)}
                      >
                        {showOptionsId === stage.id ? (
                          <FaChevronRight className="h-4 w-4" />
                        ) : (
                          <PiDotsThreeOutlineFill className="h-4 w-4" />
                        )}
                      </button>
                      {showOptionsId === stage.id && (
                        <>
                          <button
                            type="button"
                            aria-label={`Ver etapa ${stage.name}`}
                            title="Ver etapa"
                            className="
                              flex h-8 w-8 items-center justify-center rounded-md
                              border border-orange-300
                            bg-orange-50 text-orange-500
                              cursor-pointer
                              transition-colors duration-200
                            hover:bg-orange-100 hover:text-orange-600 focus:outline-none
                              disabled:cursor-not-allowed disabled:opacity-50
                            "
                            onClick={() => handleView(stage, "stage")}
                          >
                            <FaEye className="h-4 w-4" />
                          </button>
                          {editable && (
                            <button
                              type="button"
                              aria-label={`Agregar subetapa a ${stage.name}`}
                              title="Agregar subetapa"
                              className="
                              flex h-8 w-8 items-center justify-center rounded-md
                              border border-green-300
                            bg-green-50 text-green-700
                              cursor-pointer
                              transition-colors duration-200
                            hover:bg-green-100 hover:text-green-900 focus:outline-none
                              disabled:cursor-not-allowed disabled:opacity-50
                            "
                              onClick={() =>
                                handleCreateSubStage(stage, "SubStage")
                              }
                            >
                              <FaPlus className="h-4 w-4" />
                            </button>
                          )}

                          {editable && !stage.main && (
                            <button
                              type="button"
                              aria-label={`Eliminar etapa`}
                              title="Eliminar etapa"
                              className="
                                flex h-8 w-8 items-center justify-center rounded-md
                                border border-red-300
                                bg-red-100 text-red-600
                                cursor-pointer
                                transition-colors duration-200
                                hover:bg-red-200 hover:text-red-700 focus:outline-none
                                disabled:cursor-not-allowed disabled:opacity-50
                              "
                              onClick={() => handleDeactivateSubStage(stage)}
                            >
                              <FaTrash className="h-4 w-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  {stage.childrenSubstages.length > 0 && (
                    <div className="max-h-96 overflow-y-auto">
                      <SubstageTree
                        substages={stage.childrenSubstages}
                        handleView={handleView}
                        handleCreateSubStage={handleCreateSubStage}
                        handleDeactivateSubStage={handleDeactivateSubStage}
                      />
                    </div>
                  )}
                </div>
                <div className="py-4">
                  {canCreateIntermediate && (
                    <div className="flex flex-row gap-2">
                      <button
                        type="button"
                        aria-label="Agregar etapa intermedia"
                        title="Agregar etapa intermedia"
                        className="
                          flex h-8 w-8 items-center justify-center rounded-md
                          border border-green-300
                          bg-green-50 text-green-700
                          cursor-pointer
                          transition-colors duration-200
                          hover:bg-green-100 hover:text-green-900
                          focus:outline-none
                        "
                        onClick={() => handleCreateSubStage(stage, "Stage")}
                      >
                        <FaPlus className="h-4 w-4" />
                      </button>

                      {canAdvance && (
                        <button
                          type="button"
                          aria-label={`Avanzar a ${nextStage.name}`}
                          title={`Avanzar a ${nextStage.name}`}
                          className="
                            flex h-8 w-22 items-center justify-center rounded-md
                            border border-blue-300
                            bg-blue-50 text-blue-700
                            cursor-pointer
                            transition-colors duration-200
                            hover:bg-blue-100 hover:text-blue-900
                            focus:outline-none
                          "
                          onClick={() => handleAdvanceStage(stage)}
                        >
                          <FaLongArrowAltRight className="h-4 w-4" />
                        </button>
                      )}
                      {canFinalize && (
                        <button
                          type="button"
                          aria-label="Finalizar proceso"
                          title="Finalizar proceso"
                          className="
                            flex h-8 w-8 items-center justify-center rounded-md
                            border border-emerald-300
                            bg-emerald-50 text-emerald-700
                            cursor-pointer
                            transition-colors duration-200
                            hover:bg-emerald-100 hover:text-emerald-900
                            focus:outline-none
                          "
                          onClick={() => handleFinalizeProcess(stage)}
                        >
                          <FaCheck className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <CreateSubStageModal
        item={target!}
        open={open.createStage}
        handleModal={handleModal}
        type="Stage"
      />
      <CreateSubStageModal
        item={target!}
        open={open.createSubStage}
        handleModal={handleModal}
      />
      <DeactivateSubStageModal
        item={target!}
        open={open.deactivateSubStage}
        handleModal={handleModal}
      />
      <ViewStageOrSubModal
        item={target!}
        type={viewType}
        open={open.view}
        onClose={handleModal}
      />
    </div>
  );
}
