"use client";
import { ProcessStage, SubstageNode } from "@/interfaces";
import { useState } from "react";
import {
  FaEye,
  FaLongArrowAltRight,
  FaChevronDown,
  FaChevronRight,
  FaTrash,
} from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { CreateSubStageModal, DeactivateSubStageModal } from "../common";
import { SubstageTree } from "./tree/SubStageTree";
import { PiDotsThreeOutlineFill } from "react-icons/pi";

export type ProcessMapViewProps = {
  stages: ProcessStage[];
  onViewStage?: (stage: ProcessStage) => void;
  onAddSubstage?: (stage: ProcessStage) => void;
  onAdvanceStage?: (stage: ProcessStage) => void;
  onViewSubstage?: (substage: SubstageNode) => void;
  onAddChildSubstage?: (substage: SubstageNode) => void;
};

export interface OptionModal {
  createSubStage: boolean;
  deactivateSubStage: boolean;
}

export default function ProcessMapView({
  stages,
  onViewStage,
  onAdvanceStage,
  onViewSubstage,
}: ProcessMapViewProps) {
  const [target, setTarget] = useState<ProcessStage | SubstageNode>();
  const [open, setOpen] = useState<OptionModal>({
    createSubStage: false,
    deactivateSubStage: false,
  });
  const [showOptions, setShowOptions] = useState(() => stages.map(() => false));

  const handleModal = (option: keyof OptionModal, value: boolean) => {
    setOpen((prev) => ({ ...prev, [option]: value }));
  };

  const handleCreateSubStage = (stage: ProcessStage | SubstageNode) => {
    setTarget(stage);
    handleModal("createSubStage", true);
  };

  const handleDeactivateSubStage = (stage: ProcessStage | SubstageNode) => {
    setTarget(stage);
    handleModal("deactivateSubStage", true);
  };

  const handleShowOptions = (index: number) => {
    setShowOptions((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="w-full h-full py-8 px-6">
      <div className="flex min-h-full overflow-x-auto">
        <div className="flex flex-row items-start justify-start gap-4 max-w-6xl mx-auto w-max min-w-full">
          {stages.map((stage, i) => (
            <div key={stage.id} className="flex flex-row gap-4 items-start">
              <div className="flex flex-col">
                <div className="flex items-center justify-between bg-gray-300 border border-gray-800 rounded-md px-3 py-4 gap-2 min-w-[450px] text-center">
                  <p className="text-2md leading-snug text-gray-900 font-bold w-full">
                    {stage.name}
                  </p>
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
                      onClick={() => handleShowOptions(i)}
                    >
                      {showOptions[i] ? (
                        <FaChevronRight className="h-4 w-4" />
                      ) : (
                        <PiDotsThreeOutlineFill className="h-4 w-4" />
                      )}
                    </button>
                    {showOptions[i] && (
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
                          onClick={() => onViewStage?.(stage)}
                        >
                          <FaEye className="h-4 w-4" />
                        </button>
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
                          onClick={() => handleCreateSubStage(stage)}
                        >
                          <FaPlus className="h-4 w-4" />
                        </button>
                        {!stage.main && (
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
                      onViewSubstage={onViewSubstage}
                      handleCreateSubStage={handleCreateSubStage}
                      handleDeactivateSubStage={handleDeactivateSubStage}
                    />
                  </div>
                )}
              </div>
              <div className="py-4">
                {i !== stages.length - 1 && (
                  <div className="flex flex-row gap-2">
                    <button
                      type="button"
                      aria-label={`Agregar etapa intermedia`}
                      title="Agregar etapa intermedia"
                      className="
                          flex h-8 w-8 items-center justify-center rounded-md
                          border border-green-300
                        bg-green-50 text-green-700
                          cursor-pointer
                          transition-colors duration-200
                        hover:bg-green-100 hover:text-green-900 focus:outline-none
                          disabled:cursor-not-allowed disabled:opacity-50
                        "
                      onClick={() => {}}
                    >
                      <FaPlus className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Avanzar desde ${stage.name}`}
                      title="Avanzar a la siguiente etapa"
                      className="
                        flex h-8 w-22 items-center justify-center rounded-md
                        border border-blue-300
                      bg-blue-50 text-blue-700
                        cursor-pointer
                        transition-colors duration-200
                      hover:bg-blue-100 hover:text-blue-900 focus:outline-none
                        disabled:cursor-not-allowed disabled:opacity-50
                      "
                      onClick={() => onAdvanceStage?.(stage)}
                    >
                      <FaLongArrowAltRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
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
    </div>
  );
}
