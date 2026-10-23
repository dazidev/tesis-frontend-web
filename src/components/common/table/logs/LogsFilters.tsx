"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CustomSelect } from "@/components/common/select/CustomSelect";
import { LogFiltersResponse } from "@/interfaces";
import {
  getLogActionLabel,
  getLogEntityLabel,
} from "@/infrastructure/utils/log-labels";

interface Props {
  filters: LogFiltersResponse;
}

const getLocalDateTime = (value: string | null) => {
  if (!value) return { date: "", time: "" };

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return { date: "", time: "" };
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  const hours = String(parsed.getHours()).padStart(2, "0");
  const minutes = String(parsed.getMinutes()).padStart(2, "0");

  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`,
  };
};

export function LogsFilters({ filters }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [entity, setEntity] = useState(searchParams.get("entity") ?? "");
  const [action, setAction] = useState(searchParams.get("action") ?? "");
  const [userSearch, setUserSearch] = useState(
    searchParams.get("userSearch") ?? "",
  );

  const initialFrom = getLocalDateTime(searchParams.get("from"));
  const initialTo = getLocalDateTime(searchParams.get("to"));

  const [fromDate, setFromDate] = useState(initialFrom.date);
  const [fromTime, setFromTime] = useState(initialFrom.time || "00:00");
  const [toDate, setToDate] = useState(initialTo.date);
  const [toTime, setToTime] = useState(initialTo.time || "23:59");

  const [error, setError] = useState("");

  useEffect(() => {
    setEntity(searchParams.get("entity") ?? "");
    setAction(searchParams.get("action") ?? "");
    setUserSearch(searchParams.get("userSearch") ?? "");

    const from = getLocalDateTime(searchParams.get("from"));
    const to = getLocalDateTime(searchParams.get("to"));

    setFromDate(from.date);
    setFromTime(from.time || "00:00");

    setToDate(to.date);
    setToTime(to.time || "23:59");
  }, [searchParams]);

  const selectedCategory = filters.categories.find(
    (category) => category.entity === entity,
  );

  const categoryOptions = filters.categories.map((category) => ({
    value: category.entity,
    label: getLogEntityLabel(category.entity),
  }));

  const actionOptions = (selectedCategory?.actions ?? []).map((value) => ({
    value,
    label: getLogActionLabel(value),
  }));

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const params = new URLSearchParams();

    if (entity) params.set("entity", entity);
    if (action) params.set("action", action);

    if (userSearch.trim()) {
      params.set("userSearch", userSearch.trim());
    }

    const from = fromDate ? new Date(`${fromDate}T${fromTime}:00.000`) : null;

    const to = toDate ? new Date(`${toDate}T${toTime}:59.999`) : null;

    if (
      (from && Number.isNaN(from.getTime())) ||
      (to && Number.isNaN(to.getTime()))
    ) {
      setError("Las fechas u horas ingresadas no son válidas.");
      return;
    }

    if (from && to && from > to) {
      setError("La fecha inicial no puede superar la fecha final.");
      return;
    }

    if (from) params.set("from", from.toISOString());
    if (to) params.set("to", to.toISOString());

    const query = params.toString();

    startTransition(() => {
      router.push(query ? `/panel/logs?${query}` : "/panel/logs");
    });
  };

  const handleClear = () => {
    setEntity("");
    setAction("");
    setUserSearch("");
    setFromDate("");
    setFromTime("00:00");
    setToDate("");
    setToTime("23:59");
    setError("");

    startTransition(() => {
      router.push("/panel/logs");
    });
  };

  const inputClass =
    "h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-gray-900 outline-none focus:border-blue-500";

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-full flex-col gap-4 rounded-lg border border-pborder bg-pwhite p-4 shadow-sm"
    >
      <h2 className="text-lg font-medium text-pgray">Filtros de búsqueda</h2>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <CustomSelect
          id="log-entity"
          label="Categoría"
          placeholder="Todas las categorías"
          value={entity}
          setValue={(value: string) => {
            setEntity(value);
            setAction("");
          }}
          options={categoryOptions}
          allowEmptyOption
        />

        <CustomSelect
          id="log-action"
          label="Acción"
          placeholder="Todas las acciones"
          value={action}
          setValue={setAction}
          options={actionOptions}
          allowEmptyOption
        />

        <div className="flex flex-col">
          <label htmlFor="log-user" className="pb-1 pl-2 text-pgray">
            Usuario
          </label>

          <input
            id="log-user"
            type="search"
            value={userSearch}
            onChange={(event) => setUserSearch(event.target.value)}
            maxLength={100}
            placeholder="Nombre, apellido o correo"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="log-from-date" className="pb-1 pl-2 text-pgray">
            Fecha inicial
          </label>

          <input
            id="log-from-date"
            type="date"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="log-from-time" className="pb-1 pl-2 text-pgray">
            Hora inicial
          </label>

          <input
            id="log-from-time"
            type="time"
            value={fromTime}
            disabled={!fromDate}
            onChange={(event) => setFromTime(event.target.value)}
            className={`${inputClass} disabled:opacity-50`}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="log-to-date" className="pb-1 pl-2 text-pgray">
            Fecha final
          </label>

          <input
            id="log-to-date"
            type="date"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="log-to-time" className="pb-1 pl-2 text-pgray">
            Hora final
          </label>

          <input
            id="log-to-time"
            type="time"
            value={toTime}
            disabled={!toDate}
            onChange={(event) => setToTime(event.target.value)}
            className={`${inputClass} disabled:opacity-50`}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={handleClear}
          disabled={isPending}
          className="cursor-pointer rounded-lg border border-pborder bg-sbutton px-4 py-2 text-pgray hover:opacity-80 disabled:opacity-50"
        >
          Limpiar filtros
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="cursor-pointer rounded-lg bg-pbutton px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? "Buscando..." : "Buscar"}
        </button>
      </div>
    </form>
  );
}
