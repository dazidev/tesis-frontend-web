import { getProcess } from "@/actions";
import { ProcessView } from "@/components/process/ProcessView";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProcessPage({ params }: Props) {
  const { id } = await params;
  const response = await getProcess(id);

  return (
    <>
      <ProcessView data={response.data} />
    </>
  );
}
