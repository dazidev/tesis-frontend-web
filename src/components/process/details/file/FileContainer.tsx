import { DigitalFileResponse } from "@/interfaces";
import { FileItem } from "./FileItem";

interface Props {
  data: DigitalFileResponse[] | [];
  editable: boolean;
  setTarget: (id: string) => void;
  updateTarget: (id: string) => void;
  deleteTarget: (id: string) => void;
}

export const FileContainer = ({
  data,
  editable,
  setTarget,
  updateTarget,
  deleteTarget,
}: Props) => {
  return (
    <div className="flex flex-col bg-gray-100 border-1 border-lg rounded-lg p-2 gap-2">
      {data &&
        data.map((file) => (
          <FileItem
            key={file.id}
            item={file}
            editable={editable}
            setTarget={setTarget}
            updateTarget={updateTarget}
            deleteTarget={deleteTarget}
          />
        ))}
    </div>
  );
};
