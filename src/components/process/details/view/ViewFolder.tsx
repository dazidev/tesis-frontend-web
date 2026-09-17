import { getFolder } from "@/actions";
import { LoadingScreen } from "@/components/common";
import { FolderResponse } from "@/interfaces";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";

interface Props {
  id: string;
  setView: Dispatch<SetStateAction<"general" | "folder">>;
}

export const ViewFolder = ({ id, setView }: Props) => {
  const [data, setData] = useState<FolderResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getFolderById = async () => {
      setIsLoading(true);
      const response = await getFolder(id);
      if (!response.success) {
        setError(`${response.error}`);
        return;
      }
      setData(response.data);
      setIsLoading(false);
    };

    getFolderById();
  }, [id]);

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
        </div>
      )}
    </div>
  );
};
