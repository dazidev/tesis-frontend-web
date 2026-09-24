import { getFolder } from "@/actions";
import { LoadingScreen } from "@/components/common";
import { DigitalFileResponse, FolderResponse } from "@/interfaces";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FaArrowLeft, FaPlus } from "react-icons/fa6";
import { FileContainer } from "../file/FileContainer";
import { CreateUpdateFileModal } from "../file/CreateUpdateFileModal";
import { DeleteFileModal } from "../file/DeleteFileModal";

interface Props {
  id: string;
  setView: Dispatch<SetStateAction<"general" | "folder">>;
}

export const ViewFolder = ({ id, setView }: Props) => {
  const [data, setData] = useState<FolderResponse>();

  const [files, setFiles] = useState<DigitalFileResponse[]>([]);

  const [targetFile, setTargetFile] = useState<DigitalFileResponse>();

  const [isLoading, setIsLoading] = useState(false);

  const [open, setOpen] = useState({
    add: false,
    update: false,
    delete: false,
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const getFolderById = async () => {
      setIsLoading(true);

      const response = await getFolder(id);

      if (!response.success) {
        setError(`${response.error}`);
        setIsLoading(false);
        return;
      }

      setData(response.data);

      if (response.data?.digitalFiles) {
        setFiles(response.data.digitalFiles);
      }

      setIsLoading(false);
    };

    getFolderById();
  }, [id]);

  const handleModal = (option: "add" | "update" | "delete", value: boolean) => {
    setOpen((prev) => ({
      ...prev,
      [option]: value,
    }));
  };

  const addFile = (file: DigitalFileResponse) => {
    setFiles((prev) => [...prev, file]);
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const handleViewFile = (fileId: string) => {
    const file = files.find((file) => file.id === fileId);

    if (!file) return;

    const filename = file.name.replace(/\.pdf$/i, "").trim();

    window.open(
      `/api/files/${fileId}/view/${encodeURIComponent(`${filename}.pdf`)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleUpdateTarget = (fileId: string) => {
    const file = files.find((file) => file.id === fileId);

    if (!file) return;

    setTargetFile(file);

    handleModal("update", true);
  };

  const updateFileState = (updatedFile: DigitalFileResponse) => {
    setFiles((prev) =>
      prev.map((file) => (file.id === updatedFile.id ? updatedFile : file)),
    );
  };

  const handleDeleteTarget = (fileId: string) => {
    const file = files.find((file) => file.id === fileId);

    if (!file) return;

    setTargetFile(file);

    handleModal("delete", true);
  };

  return (
    <div className="flex flex-col text-gray-900">
      {isLoading && <LoadingScreen />}

      {!isLoading && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-5">
            <button
              type="button"
              aria-label={`Agregar etapa intermedia`}
              title="Agregar etapa intermedia"
              className="
                flex h-9 w-9 items-center justify-center
                text-gray-700 cursor-pointer
                border border-transparent rounded-sm
                transition-colors duration-200 p-2
                hover:border-gray-200
                hover:bg-gray-100 hover:text-gray-800
                disabled:cursor-not-allowed disabled:opacity-50
              "
              onClick={() => setView("general")}
            >
              <FaArrowLeft className="h-10 w-10" />
            </button>

            <span>
              Documentos de la carpeta digital ({data?.name.toUpperCase()})
            </span>
          </div>

          <div className="flex flex-row items-center justify-between px-2">
            <span>Documentos ({files ? files.length : "0"})</span>

            <button
              type="button"
              aria-label={`Agregar etapa intermedia`}
              title="Agregar etapa intermedia"
              className="
                flex h-7 w-7 items-center justify-center rounded-md
                border border-green-300
                bg-green-50 text-green-700
                cursor-pointer
                transition-colors duration-200
                hover:bg-green-100 hover:text-green-900 focus:outline-none
                disabled:cursor-not-allowed disabled:opacity-50
              "
              onClick={() => handleModal("add", true)}
            >
              <FaPlus className="h-4 w-4" />
            </button>
          </div>

          <div>
            {files.length > 0 && (
              <FileContainer
                data={files}
                setTarget={handleViewFile}
                updateTarget={handleUpdateTarget}
                deleteTarget={handleDeleteTarget}
              />
            )}
          </div>
        </div>
      )}

      {open.add && data && (
        <CreateUpdateFileModal
          type={"create"}
          item={data}
          open={open.add}
          handleModal={handleModal}
          addFile={addFile}
          updateFileState={updateFileState}
        />
      )}
      {open.update && data && targetFile && (
        <CreateUpdateFileModal
          type="update"
          item={data}
          targetFile={targetFile}
          open={open.update}
          handleModal={handleModal}
          addFile={addFile}
          updateFileState={updateFileState}
        />
      )}
      {open.delete && targetFile && (
        <DeleteFileModal
          file={targetFile}
          open={open.delete}
          handleModal={handleModal}
          removeFile={removeFile}
        />
      )}
    </div>
  );
};
