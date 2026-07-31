"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import { FaHome, FaUsers, FaBalanceScale } from "react-icons/fa";

type IconName = "home" | "users" | "balance";

interface Props {
  label: string;
  icon: IconName;
  path: string;
}

const icons: Record<IconName, IconType> = {
  home: FaHome,
  users: FaUsers,
  balance: FaBalanceScale,
};

const isActive = (currentPath: string, path: string) => {
  if (path === "/panel") {
    return currentPath === "/panel";
  }

  return currentPath === path || currentPath.startsWith(`${path}/`);
};

export const AsideNavItem = ({ label, icon, path }: Props) => {
  const currentPath = usePathname();
  const Icon = icons[icon];

  return (
    <li className="w-full">
      <Link
        href={path}
        className={`flex flex-row gap-2 items-center text-lg p-2 rounded-lg outline-none focus:outline-none
            ${isActive(currentPath, path) ? "bg-white shadow-sm" : "hover:bg-white hover:shadow-sm"}
          `}
      >
        <Icon className="text-xl" />
        <span>{label}</span>
      </Link>
    </li>
  );
};
