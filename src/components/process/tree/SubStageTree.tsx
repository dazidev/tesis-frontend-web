import { ProcessStage, SubstageNode } from "@/interfaces";
import { SubstageItem } from "./SubStageItem";

export function SubstageTree({
  substages,
  depth = 0,
  onViewSubstage,
  handleCreateSubStage,
  handleDeactivateSubStage,
}: {
  substages: SubstageNode[];
  depth?: number;
  onViewSubstage?: (substage: SubstageNode) => void;
  handleCreateSubStage: (stage: ProcessStage | SubstageNode) => void;
  handleDeactivateSubStage: (stage: ProcessStage | SubstageNode) => void;
}) {
  if (substages.length === 0) return null;

  return (
    <ul
      className={`flex flex-col gap-2 ${
        depth === 0
          ? "mt-3"
          : "mt-2 ml-4 pl-4 border-l-2 border-dashed border-gray-400"
      }`}
    >
      {substages.map((substage) => (
        <SubstageItem
          key={substage.id}
          substage={substage}
          depth={depth}
          onViewSubstage={onViewSubstage}
          handleCreateSubStage={handleCreateSubStage}
          handleDeactivateSubStage={handleDeactivateSubStage}
        />
      ))}
    </ul>
  );
}
