import { getProcesses } from "@/actions";
import { ProcessesTable } from "@/components/common";

export default async function UsersPage() {
  const processes = await getProcesses();

  return (
    <div className="flex flex-col gap-3 w-full h-full px-3 py-5">
      <ProcessesTable processes={processes.data ?? []} />
    </div>
  );
}
