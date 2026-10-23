import { getLogFilters, getLogs } from "@/actions";
import { LogsFilters, LogsPagination, LogsTable } from "@/components/common";
import { auth } from "@/infrastructure/lib/auth";
import { FindLogsRequest } from "@/interfaces";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface Props {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

export default async function LogsPage({ searchParams }: Props) {
  const session = await auth();

  if (!session?.user.roles.includes("admin")) {
    redirect("/panel");
  }

  const params = await searchParams;

  const getParam = (key: string) => {
    const value = params[key];
    return typeof value === "string" ? value : undefined;
  };

  const requestedPage = Number(getParam("page") ?? 1);

  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const limit = 20;

  const query: FindLogsRequest = {
    entity: getParam("entity"),
    action: getParam("action"),
    userSearch: getParam("userSearch"),
    from: getParam("from"),
    to: getParam("to"),
    page,
    limit,
  };

  const [logsResponse, filtersResponse] = await Promise.all([
    getLogs(query),
    getLogFilters(),
  ]);

  const logs = logsResponse.data;

  return (
    <div className="flex h-full w-full flex-col gap-4 px-3 py-5">
      {filtersResponse.success && filtersResponse.data ? (
        <Suspense fallback={null}>
          <LogsFilters filters={filtersResponse.data} />
        </Suspense>
      ) : (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
          {filtersResponse.error ?? "No fue posible cargar los filtros."}
        </div>
      )}

      {!logsResponse.success || !logs ? (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
          {logsResponse.error ?? "No fue posible cargar los registros."}
        </div>
      ) : (
        <>
          <LogsTable logs={logs.data} />

          <Suspense fallback={null}>
            <LogsPagination
              page={logs.page}
              limit={logs.limit}
              totalCount={logs.totalCount}
              totalPages={logs.totalPages}
            />
          </Suspense>
        </>
      )}
    </div>
  );
}
