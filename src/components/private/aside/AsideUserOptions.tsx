"use client";

import { logout } from "@/actions";
import { useState } from "react";
import { FaAngleUp, FaUser } from "react-icons/fa";

interface Props {
  fullname: string;
  email: string;
}

export const AsideUserOptions = ({ fullname, email }: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="relative w-full">
      {open && (
        <div className="absolute bottom-full left-0 z-50 w-full p-3">
          <div className="rounded-xl border border-pborder bg-white shadow-lg">
            <button
              className="w-full px-4 py-3 text-left"
              onClick={() => {
                setOpen(false);
                logout();
              }}
            >
              <span className="text-black hover:text-red-600 hover:cursor-pointer">
                Cerrar sesión
              </span>
            </button>
          </div>
        </div>
      )}

      <div className="flex h-20 w-full flex-row items-center justify-between border-t border-t-pborder p-5 text-black">
        <div className="flex min-w-0 gap-2">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
            <FaUser className="text-2xl" />
          </div>

          <div className="flex min-w-0 flex-col">
            <span className="truncate font-bold">{fullname}</span>
            <span className="truncate text-pgray">{email}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={`flex items-center justify-center transition-transform hover:cursor-pointer ${
            open ? "rotate-180" : ""
          }`}
        >
          <FaAngleUp className="text-xl" />
        </button>
      </div>
    </div>
  );
};
