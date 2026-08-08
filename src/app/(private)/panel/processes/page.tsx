import { getProcesses } from "@/actions";
import { CreateProcessModal, ProcessesTable } from "@/components/common";

export default async function ProcessesPage() {
  const processes = await getProcesses();

  return (
    <div className="flex flex-col gap-3 w-full h-full px-3 py-5">
      <div className="flex w-full justify-start">
        <CreateProcessModal />
      </div>
      <ProcessesTable processes={processes.data ?? []} />
    </div>
  );
}
