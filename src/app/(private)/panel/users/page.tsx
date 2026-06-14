import { getAllUsers } from "@/actions/user/user.actions";
import { UsersTable } from "@/components/common";

export default async function UsersPage() {
  const users = await getAllUsers();

  return (
    <div className="flex flex-col gap-3 w-full h-full px-3 py-5">
      <div className="flex w-full justify-start">
        <button
          className="flex justify-center w-40 bg-pwhite p-2 text-black/60 
          border border-pborder shadow-sm sm:rounded-lg
          hover:cursor-pointer hover:text-black/80 hover:scale-102"
        >
          <span className="text-base uppercase">Invitar usuario</span>
        </button>
      </div>

      <UsersTable users={users.data ?? []} />
    </div>
  );
}
