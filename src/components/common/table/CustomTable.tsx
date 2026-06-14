export type Column<T> = {
  header: string;
  value: (item: T) => React.ReactNode;
  className?: string;
};

interface Props<T> {
  name: string;
  items: T[];
  columns: Column<T>[];
  getKey: (item: T) => string;
  emptyMessage?: string;
}

export function CustomTable<T>({
  name,
  items,
  columns,
  getKey,
  emptyMessage = "No hay datos disponibles",
}: Props<T>) {
  return (
    <div className="w-full bg-pwhite p-2 shadow-sm sm:rounded-lg border border-pborder">
      <span className="flex p-3 text-lg text-black/60 uppercase">{name}</span>

      <div className="w-full overflow-x-auto relative rounded-lg border border-gray-300">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-gray-700 uppercase">
            <tr className="bg-gray-100">
              {columns.map((column, index) => {
                const isLast = index === columns.length - 1;
                return (
                  <th
                    key={column.header}
                    scope="col"
                    className={`py-3 px-6 ${isLast ? "text-left" : ""}`}
                  >
                    <span className={`font-bold text-black`}>
                      {column.header}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-6 px-6 text-center text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={getKey(item)}
                  className="bg-white border-t border-gray-300"
                >
                  {columns.map((column) => (
                    <td
                      key={column.header}
                      className={`py-4 px-6 ${column.className ?? ""}`}
                    >
                      {column.value(item)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
