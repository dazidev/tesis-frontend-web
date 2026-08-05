"use client";
import { SetStateAction, useEffect, useMemo, useState } from "react";
import { CustomModal } from "../CustomModal";
import { CustomInput } from "../../input/CustomInput";
import { CustomSelect } from "../../select/CustomSelect";
import toast from "react-hot-toast";
import { SearchUserModal } from "../search-user/SearchUserModal";
import { getLawyers } from "@/actions";
import { UserBasicResponse } from "@/interfaces";
import { FaTrash } from "react-icons/fa";

type DefendantType = {
  name: string;
  lastname: string;
  birthDate: Date | null;
  deathDate: Date | null;
};

type CreateProcessForm = {
  courtNumber: string;
  caseFileNumber: string;
  type: string;
  managedByID: string;
  defendant: DefendantType;
};

const InitialCreateProcessForm: CreateProcessForm = {
  courtNumber: "",
  caseFileNumber: "",
  type: "",
  managedByID: "",
  defendant: {
    name: "",
    lastname: "",
    birthDate: null,
    deathDate: null,
  },
};

export function CreateProcessModal() {
  const [open, setOpen] = useState({
    create: false,
    search: false,
  });
  const [form, setForm] = useState<CreateProcessForm>(InitialCreateProcessForm);
  const [users, setUsers] = useState<UserBasicResponse[]>();

  useEffect(() => {
    const loadUsers = async () => {
      const response = await getLawyers();
      if (response && response.data) {
        setUsers(response.data);
      }
    };

    loadUsers();
  }, []);

  const manager = useMemo(() => {
    if (users) {
      return users.find((user) => user.id === form.managedByID);
    }
    return null;
  }, [form.managedByID]);

  const handleProcess = (value: any, option: keyof CreateProcessForm) => {
    setForm((prev) => ({ ...prev, [option]: value }));
  };

  const setManagerUser = (id: string) => {
    handleProcess(id, "managedByID");
  };

  const handleDefendant = (value: any, option: keyof DefendantType) => {
    setForm((prev) => ({
      ...prev,
      defendant: {
        ...prev.defendant,
        [option]: value,
      },
    }));
  };

  const cleanForm = () => {
    setForm(InitialCreateProcessForm);
  };

  const handleClose = () => {
    cleanForm();
    setOpen((prev) => ({ ...prev, create: false }));
  };

  const handleCloseSearch = () => {
    setOpen((prev) => ({ ...prev, search: false }));
  };

  const handleSendUserInvitation = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    try {
      if (!form.courtNumber || form.courtNumber.length <= 1)
        throw new Error("Ingrese el juzgado.");

      if (!form.caseFileNumber || form.caseFileNumber.length <= 1)
        throw new Error("Ingrese el expediente.");

      if (!form.type) throw new Error("Seleccione el tipo de proceso.");

      if (!form.defendant.name || form.defendant.name.length <= 1)
        throw new Error("Ingrese el nombre del finado.");

      if (!form.defendant.lastname || form.defendant.lastname.length <= 1)
        throw new Error("Ingrese el apellido del finado.");

      if (!form.defendant.birthDate)
        throw new Error("Seleccione la fecha de nacimiento del finado.");

      if (!form.defendant.deathDate)
        throw new Error("Seleccione la fecha de defunción del fiando.");

      /*const data: CreateProcessForm = {
        toEmail: form.email,
        role: form.role,
      };

      const response = await sendUserInvitation(data);

      if (!response.success) throw new Error(response.error);

      toast.success(response.message!);*/
      cleanForm();
    } catch (error: unknown) {
      if (typeof error === "string") {
        toast.error(error);
        return;
      }
      toast.error("Hubo un error desconocido al generar la invitación.");
      return;
    }
  };

  return (
    <>
      <button
        className="flex justify-center w-40 bg-pwhite p-2 text-black/60 
          border border-pborder shadow-sm sm:rounded-lg
          hover:cursor-pointer hover:text-black/80 hover:scale-102"
        onClick={() => setOpen((prev) => ({ ...prev, create: true }))}
      >
        <span className="text-base uppercase">Crear Proceso</span>
      </button>
      {open && (
        <CustomModal
          open={open.create}
          title="Crear Proceso"
          onClose={() => handleClose()}
          footer={
            <>
              <button
                type="button"
                className="cursor-pointer rounded-md border px-4 py-2 text-sm text-black/80"
                onClick={() => handleClose()}
              >
                Cancelar
              </button>

              <button
                type="submit"
                form="create-process-form"
                className="cursor-pointer rounded-md bg-black px-4 py-2 text-sm text-white"
              >
                Crear
              </button>
            </>
          }
        >
          <form
            id="create-process-form"
            className="space-y-4"
            onSubmit={handleSendUserInvitation}
          >
            <CustomInput
              id={"court-number"}
              type={"text"}
              label={"Juzgado"}
              placeholder={"Ingrese el juzgado"}
              value={form.courtNumber}
              setValue={(value: any) => handleProcess(value, "courtNumber")}
              required
            />
            <CustomInput
              id={"case-file-number"}
              type={"text"}
              label={"Expediente"}
              placeholder={"Ingrese el expediente"}
              value={form.caseFileNumber}
              setValue={(value: any) => handleProcess(value, "caseFileNumber")}
              required
            />
            <CustomSelect
              id="process-type"
              label="Type"
              placeholder="Selecciona un tipo de proceso"
              value={form.type}
              setValue={(value: any) => handleProcess(value, "type")}
              required
              options={[
                {
                  label: "Testamentario",
                  value: "testate",
                },
                {
                  label: "Intestamentario",
                  value: "intestate",
                },
                {
                  label: "Mixto",
                  value: "mixed",
                },
              ]}
            />
            <span className="text-gray-900">Datos del finado:</span>
            <CustomInput
              id={"defendant-name"}
              type={"text"}
              label={"Nombre/s"}
              placeholder={"Ingrese el nombre"}
              value={form.defendant.name}
              setValue={(value: any) => handleDefendant(value, "name")}
              required
            />
            <CustomInput
              id={"defendant-lastname"}
              type={"text"}
              label={"Apellido/s"}
              placeholder={"Ingrese el apellido"}
              value={form.defendant.lastname}
              setValue={(value: any) => handleDefendant(value, "lastname")}
              required
            />
            <CustomInput
              id={"defendant-birth-date"}
              type={"date"}
              label={"Fecha de nacimiento"}
              placeholder={"Ingrese el nombre"}
              value={form.defendant.birthDate}
              setValue={(value: any) => handleDefendant(value, "birthDate")}
              required
            />
            <CustomInput
              id={"defendant-death-date"}
              type={"date"}
              label={"Fecha de defunción"}
              placeholder={"Ingrese la fecha de defunción"}
              value={form.defendant.deathDate}
              setValue={(value: any) => handleDefendant(value, "deathDate")}
              required
            />
            <span className="text-gray-900">Manejado por:</span>
            {manager ? (
              <div className="w-full flex flex-row justify-between p-3 border mt-2 rounded-lg text-gray-900">
                <div className="flex flex-col">
                  <span className="text-lg">
                    {manager.name} {manager.lastname}
                  </span>
                  <span className="text-sm">{manager.email}</span>
                  <span className="text-sm">{manager.roles[0]}</span>
                </div>
                <div className="flex justify-center items-center">
                  <button
                    type="button"
                    aria-label={`Remover administrador`}
                    title="Remover administrador"
                    className="flex h-8 w-8 items-center justify-center rounded-md
                      border border-red-300 bg-red-600/10 text-red-600
                      cursor-pointer transition-colors duration-200
                    hover:bg-red-600/20 hover:text-red-700 focus:outline-none
                      disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => setManagerUser("")}
                  >
                    <FaTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <span className="flex text-center text-gray-900 bg-red-300 border-2 border-red-600 p-2 rounded-lg mt-2">
                Si no selecciona el usuario que va administrar el proceso el
                sistema lo registrará a usted como administrador.
              </span>
            )}
            <button
              type="button"
              className="w-full h-11 bg-pblue rounded-lg hover:bg-pbutton cursor-pointer focus:scale-105"
              onClick={() => setOpen((prev) => ({ ...prev, search: true }))}
            >
              <span className="text-white">Seleccionar usuario</span>
            </button>
          </form>
        </CustomModal>
      )}
      <SearchUserModal
        setManagerUser={setManagerUser}
        open={open.search}
        setClose={handleCloseSearch}
        managerUserTarget={form.managedByID}
        users={users}
        setUsers={setUsers}
      />
    </>
  );
}
