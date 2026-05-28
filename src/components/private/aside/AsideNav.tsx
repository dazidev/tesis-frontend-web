"use server";
import { auth } from "@/infrastructure/lib/auth";
import { AsideNavItem } from "./AsideNavItem";
import { FaUser } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa";
import { AsideUserOptions } from "./AsideUserOptions";

export const AsideNav = async () => {
  const session = await auth();
  const fullname = `${session?.user.name} ${session?.user.lastname}`;
  const email = `${session?.user.email}`;

  return (
    <aside className="flex flex-col justify-between w-[300px] shrink-0 h-screen bg-pwhite border-r border-r-pborder">
      <div className="p-5">
        <ul className="flex flex-col w-full py-5 gap-0.5 text-black">
          <AsideNavItem label={"Inicio"} icon={"home"} path={"/panel"} />
          <AsideNavItem
            label={"Usuarios"}
            icon={"users"}
            path={"/panel/users"}
          />
        </ul>
      </div>
      <AsideUserOptions fullname={fullname} email={email} />
    </aside>
  );
};
