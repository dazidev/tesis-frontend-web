import { BasicDigitalFolderResponse } from "@/interfaces";
import { FolderItem } from "./FolderItem";

interface Props {
  data: BasicDigitalFolderResponse[];
}

export const FolderContainer = ({ data }: Props) => {
  return (
    <div className="flex flex-col bg-gray-100 border-1 border-lg rounded-lg p-2 gap-2">
      {data.map((folder) => (
        <FolderItem key={folder.id} item={folder} />
      ))}
    </div>
  );
};
