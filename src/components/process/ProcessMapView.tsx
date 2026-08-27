import React from "react";
import { FaEye, FaLongArrowAltRight } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";

type StageStatus = "created" | "opened" | "closed";

type SubstageNode = {
  id: string;
  name: string;
  description: string;
  status: string;
  order: number;
  childrenSubstages: SubstageNode[];
};

export type ProcessStage = {
  id: string;
  name: string;
  order: number;
  status: StageStatus;
  childrenSubstages: SubstageNode[];
};

type ProcessMapViewProps = {
  stages: ProcessStage[];
  onViewStage?: (stage: ProcessStage) => void;
  onAddSubstage?: (stage: ProcessStage) => void;
  onAdvanceStage?: (stage: ProcessStage) => void;
};

export default function ProcessMapView({
  stages,
  onViewStage,
  onAddSubstage,
  onAdvanceStage,
}: ProcessMapViewProps) {
  return (
    <div className="w-full py-8 px-6">
      <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 max-w-6xl mx-auto">
        {stages.map((stage, i) => (
          <div key={stage.id} className="flex flex-row gap-4 items-center">
            <div className="flex-1 flex items-center justify-between bg-gray-300 border border-gray-800 rounded-md px-3 py-10 max-h-20 text-center gap-2">
              <p className="text-2md leading-snug text-gray-900 font-bold">
                {stage.name}
              </p>
              <div className="flex flex-row gap-2">
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
                  onClick={() => onAddSubstage?.(stage)}
                >
                  <FaPlus className="h-4 w-4" />
                </button>
              </div>
            </div>
            {i !== stages.length - 1 && (
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
