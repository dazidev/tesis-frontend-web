import { DigitalFileResponse } from "@/interfaces";
import { FileItem } from "./FileItem";

interface Props {
  data: DigitalFileResponse[];
  setTarget: (id: string) => void;
}

export const FileContainer = ({ data, setTarget }: Props) => {
  return (
    <div className="flex flex-col bg-gray-100 border-1 border-lg rounded-lg p-2 gap-2">
      {data.map((folder) => (
        <FileItem key={folder.id} item={folder} setTarget={setTarget} />
      ))}
    </div>
  );
};
