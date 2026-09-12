import { ProcessStage, SubstageNode } from "@/interfaces";
import { SubstageItem } from "./SubStageItem";
import { ViewType } from "../ProcessMapView";

export function SubstageTree({
  substages,
  depth = 0,
  handleView,
  handleCreateSubStage,
  handleDeactivateSubStage,
}: {
  substages: SubstageNode[];
  depth?: number;
  handleView: (stage: ProcessStage | SubstageNode, type: ViewType) => void;
  handleCreateSubStage: (
    stage: ProcessStage | SubstageNode,
    option: "Stage" | "SubStage",
  ) => void;
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
          handleView={handleView}
          handleCreateSubStage={handleCreateSubStage}
          handleDeactivateSubStage={handleDeactivateSubStage}
        />
      ))}
    </ul>
  );
}
