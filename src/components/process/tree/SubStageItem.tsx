import { ProcessStage, SubstageNode } from "@/interfaces";
import { useState } from "react";
import { FaChevronDown, FaChevronRight, FaEye, FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { SubstageTree } from "./SubStageTree";
import { PiDotsThreeOutlineFill } from "react-icons/pi";

export function SubstageItem({
  substage,
  depth,
  onViewSubstage,
  handleCreateSubStage,
  handleDeactivateSubStage,
}: {
  substage: SubstageNode;
  depth: number;
  onViewSubstage?: (substage: SubstageNode) => void;
  handleCreateSubStage: (stage: ProcessStage | SubstageNode) => void;
  handleDeactivateSubStage: (stage: ProcessStage | SubstageNode) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const hasChildren = substage.childrenSubstages.length > 0;

  const handleShowOptions = () => {
    setShowOptions((prev) => !prev);
  };

  return (
    <li className="flex flex-col w-full overflow-hidden">
      <div className="flex items-center gap-2 min-w-max">
        {hasChildren ? (
          <button
            type="button"
            aria-label={expanded ? "Colapsar" : "Expandir"}
            onClick={() => setExpanded((prev) => !prev)}
            className="text-gray-500 hover:text-gray-800 cursor-pointer shrink-0"
          >
            {expanded ? (
              <FaChevronDown className="h-3 w-3" />
            ) : (
              <FaChevronRight className="h-3 w-3" />
            )}
          </button>
        ) : (
          <span className="w-3 shrink-0" />
        )}

        <div className="flex items-center justify-between gap-3 bg-gray-100 border border-gray-400 rounded-md px-3 py-2 w-full">
          <span className="text-sm font-medium text-gray-800 whitespace-nowrap">
            {substage.name}
          </span>
          <div className="flex flex-row gap-1 shrink-0">
            <button
              type="button"
              aria-label={`Ver opciones`}
              title="Ver opciones"
              className="
                flex h-6 w-6 items-center justify-center rounded-md
                border border-gray-300
                bg-gray-100 text-gray-500
                cursor-pointer
                transition-colors duration-200
                hover:bg-gray-50 hover:text-gray-600 focus:outline-none
                disabled:cursor-not-allowed disabled:opacity-50
              "
              onClick={handleShowOptions}
            >
              {showOptions ? (
                <FaChevronRight className="h-3 w-3" />
              ) : (
                <PiDotsThreeOutlineFill className="h-3 w-3" />
              )}
            </button>
            {showOptions && (
              <>
                <button
                  type="button"
                  aria-label={`Ver subetapa ${substage.name}`}
                  title="Ver subetapa"
                  className="
                    flex h-6 w-6 items-center justify-center rounded-md
                    border border-orange-300
                    bg-orange-50 text-orange-500
                    cursor-pointer
                    transition-colors duration-200
                    hover:bg-orange-100 hover:text-orange-600 focus:outline-none
                  "
                  onClick={() => onViewSubstage?.(substage)}
                >
                  <FaEye className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  aria-label={`Agregar subetapa hija de ${substage.name}`}
                  title="Agregar subetapa"
                  className="
                    flex h-6 w-6 items-center justify-center rounded-md
                    border border-green-300
                    bg-green-50 text-green-700
                    cursor-pointer
                    transition-colors duration-200
                    hover:bg-green-100 hover:text-green-900 focus:outline-none
                  "
                  onClick={() => handleCreateSubStage(substage)}
                >
                  <FaPlus className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  aria-label={`Eliminar etapa`}
                  title="Eliminar etapa"
                  className="
                    flex h-6 w-6 items-center justify-center rounded-md
                    border border-red-300
                    bg-red-100 text-red-600
                    cursor-pointer
                    transition-colors duration-200
                    hover:bg-red-200 hover:text-red-700 focus:outline-none
                    disabled:cursor-not-allowed disabled:opacity-50
                  "
                  onClick={() => handleDeactivateSubStage(substage)}
                >
                  <FaTrash className="h-3 w-3" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {hasChildren && expanded && (
        <SubstageTree
          substages={substage.childrenSubstages}
          depth={depth + 1}
          onViewSubstage={onViewSubstage}
          handleCreateSubStage={handleCreateSubStage}
          handleDeactivateSubStage={handleDeactivateSubStage}
        />
      )}
    </li>
  );
}
