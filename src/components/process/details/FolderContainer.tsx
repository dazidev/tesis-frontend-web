import { BasicDigitalFolderResponse } from "@/interfaces";
import { FolderItem } from "./FolderItem";

interface Props {
  data: BasicDigitalFolderResponse[];
  setTarget: (id: string) => void;
  updateTarget: (id: string) => void;
  deleteTarget: (id: string) => void;
}

export const FolderContainer = ({
  data,
  setTarget,
  updateTarget,
  deleteTarget,
}: Props) => {
  return (
    <div className="flex flex-col bg-gray-100 border-1 border-lg rounded-lg p-2 gap-2">
      {data.map((folder) => (
        <FolderItem
          key={folder.id}
          item={folder}
          setTarget={setTarget}
          updateTarget={updateTarget}
          deleteTarget={deleteTarget}
        />
      ))}
    </div>
  );
};
