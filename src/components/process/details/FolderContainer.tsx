import { FaEye, FaPlus, FaTrash } from "react-icons/fa6";

export const FolderContainer = () => {
  return (
    <div className="flex flex-col gap-2 mt-2">
      <div className="flex flex-row items-center justify-between px-2">
        <span>Archivos</span>
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
          onClick={() => {}}
        >
          <FaPlus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col bg-gray-100 border-1 border-lg rounded-lg p-2">
        <div className="flex flex-row border-1 rounded-sm p-1 px-2 bg-gray-200 items-center justify-between">
          <span>Actas de nacimiento</span>
          <div className="flex flex-row gap-1">
            <button
              type="button"
              aria-label={`Ver etapa`}
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
              onClick={() => {}}
            >
              <FaEye className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label={`Eliminar etapa`}
              title="Eliminar etapa"
              className="
                flex h-8 w-8 items-center justify-center rounded-md
                border border-red-300
                bg-red-100 text-red-600
                cursor-pointer
                transition-colors duration-200
                hover:bg-red-200 hover:text-red-700 focus:outline-none
                disabled:cursor-not-allowed disabled:opacity-50
              "
              onClick={() => {}}
            >
              <FaTrash className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
