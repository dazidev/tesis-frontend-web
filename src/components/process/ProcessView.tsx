"use client";
import { processStatusNames, processStatusStyles } from "@/infrastructure";
import { ProcessByIdResponse } from "@/interfaces";
import { useEffect, useState } from "react";
import ProcessMapView from "./ProcessMapView";

interface Props {
  data: ProcessByIdResponse | undefined;
}

export function ProcessView({ data }: Props) {
  const [process, setProcess] = useState<ProcessByIdResponse>();

  useEffect(() => {
    if (data) {
      setProcess(data);
    }
  }, []);

  return (
    <>
      {process && (
        <div className="flex flex-col gap-3 w-full h-full px-3 py-5">
          <div className="w-full overflow-x-auto relative rounded-lg border border-gray-300">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs text-gray-700 uppercase">
                <tr className="bg-gray-100">
                  <th scope="col" className={`py-3 px-6 text-left`}>
                    <span className={`font-bold text-black`}>Expediente</span>
                  </th>
                  <th scope="col" className={`py-3 px-6 text-left`}>
                    <span className={`font-bold text-black`}>Juzgado</span>
                  </th>
                  <th scope="col" className={`py-3 px-6 text-left`}>
                    <span className={`font-bold text-black`}>Tipo</span>
                  </th>
                  <th scope="col" className={`py-3 px-6 text-left`}>
                    <span className={`font-bold text-black`}>Estado</span>
                  </th>
                  <th scope="col" className={`py-3 px-6 text-left`}>
                    <span className={`font-bold text-black`}>Demandado</span>
                  </th>
                  <th scope="col" className={`py-3 px-6 text-left`}>
                    <span className={`font-bold text-black`}>Demandantes</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="py-6 px-6 text-left bg-white text-gray-700">
                    {process.caseFileNumber}
                  </td>
                  <td className="py-6 px-6 text-left bg-white text-gray-700">
                    {process.courtNumber}
                  </td>
                  <td className="py-6 px-6 text-left bg-white text-gray-700">
                    {process.type}
                  </td>
                  <td className="py-6 px-6 text-left bg-white text-gray-700">
                    <span
                      className={`px-2 py-1 rounded-lg ${processStatusStyles[process.status]}`}
                    >
                      {processStatusNames[process.status]}
                    </span>
                  </td>
                  <td className="py-6 px-6 text-left bg-white text-gray-700">
                    {`${process.defendant.name} ${process.defendant.lastname}`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <ProcessMapView />
        </div>
      )}
    </>
  );
}
