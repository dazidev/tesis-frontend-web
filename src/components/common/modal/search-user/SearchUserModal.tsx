"use client";

import { useEffect, useMemo, useState } from "react";
import { CustomModal } from "../CustomModal";
import { CustomInput } from "../../input/CustomInput";
import { getLawyers } from "@/actions";
import { UserBasicResponse } from "@/interfaces";
import { SearchUserItem } from "./SearchUserItem";

interface Props {
  setManagerUser: (id: string) => void;
  managerUserTarget: string;
  open: boolean;
  setClose: () => void;
  users: UserBasicResponse[] | undefined;
  setUsers: React.Dispatch<
    React.SetStateAction<UserBasicResponse[] | undefined>
  >;
}

export function SearchUserModal({
  setManagerUser,
  managerUserTarget,
  open,
  setClose,
  users,
  setUsers,
}: Props) {
  const [search, setSearch] = useState("");

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
    setClose();
    setSearch("");
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
                type="button"
                form="create-process-form"
                className="cursor-pointer rounded-md bg-black px-4 py-2 text-sm text-white"
                onClick={handleClose}
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
              <SearchUserItem
                key={user.id}
                id={user.id}
                fullname={`${user.name} ${user.lastname}`}
                email={user.email}
                role={user.roles[0]}
                setManagerUser={setManagerUser}
                managerUserTarget={managerUserTarget}
              />
            ))}
          </div>
        </CustomModal>
      )}
    </>
  );
}
