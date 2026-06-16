import { getAllUsers } from "@/actions/user/user.actions";
import { InviteUserModal, UsersTable } from "@/components/common";

export default async function UsersPage() {
  const users = await getAllUsers();

  return (
    <div className="flex flex-col gap-3 w-full h-full px-3 py-5">
      <div className="flex w-full justify-start">
        <InviteUserModal />
      </div>

      <UsersTable users={users.data ?? []} />
    </div>
  );
}
