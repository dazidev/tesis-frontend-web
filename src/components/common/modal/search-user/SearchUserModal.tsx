"use client";

import { useEffect, useMemo, useState } from "react";
import { CustomModal } from "../CustomModal";
import { CustomInput } from "../../input/CustomInput";
import { getLawyers } from "@/actions";
import { UserBasicResponse } from "@/interfaces";

interface Props {
  setManagerUser: (id: string) => void;
}

export function SearchUserModal({ setManagerUser }: Props) {
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState("");
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

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return [];

    const filter = search.toLowerCase().replace(/\s+/g, "");

    return (users ?? []).filter((user) => {
      const identifiers = `${user.email}${user.name}${user.lastname}`
        .toLowerCase()
        .replace(/\s+/g, "");

      return identifiers.includes(filter);
    });
  }, [users, search]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {open && (
        <CustomModal
          open={open}
          title="Buscar usuario"
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
                Aceptar
              </button>
            </>
          }
        >
          <div>
            <CustomInput
              id={"search-user"}
              type={"text"}
              label={"Buscar usuario"}
              placeholder={"Ingrese nombre o correo electrónico del usuario"}
              value={search}
              setValue={setSearch}
              required
            />
          </div>
          <div>
            {filteredUsers.map((user) => (
              <div>
                <span>{`${user.name} ${user.lastname}`}</span>
                <span>{`${user.email}`}</span>
              </div>
            ))}
          </div>
        </CustomModal>
      )}
    </>
  );
}
