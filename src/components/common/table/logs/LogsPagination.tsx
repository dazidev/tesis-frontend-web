"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface Props {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export function LogsPagination({ page, limit, totalCount, totalPages }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const changePage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) return;

    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(nextPage));

    startTransition(() => {
      router.push(`/panel/logs?${params.toString()}`);
    });
  };

  if (totalCount === 0) return null;

  const first = (page - 1) * limit + 1;
  const last = Math.min(page * limit, totalCount);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-pborder bg-pwhite p-4">
      <span className="text-sm text-pgray">
        Mostrando {first}-{last} de {totalCount} registros
      </span>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={page <= 1 || isPending}
          onClick={() => changePage(page - 1)}
          className="cursor-pointer rounded-md border border-pborder bg-white px-3 py-2 text-sm text-pgray disabled:cursor-not-allowed disabled:opacity-40"
        >
          Anterior
        </button>

        <span className="text-sm text-pgray">
          Página {page} de {totalPages}
        </span>

        <button
          type="button"
          disabled={page >= totalPages || isPending}
          onClick={() => changePage(page + 1)}
          className="cursor-pointer rounded-md border border-pborder bg-white px-3 py-2 text-sm text-pgray disabled:cursor-not-allowed disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
