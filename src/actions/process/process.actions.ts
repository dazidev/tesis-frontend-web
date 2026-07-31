"use server";

import { ProcessResponse } from "@/interfaces";
import {
  NextServerResponse,
  ProcessDeactivationRequest,
} from "../../interfaces/next/next.interface";
import { serverApi } from "@/infrastructure/lib/api/server-api";

export async function getProcesses(): Promise<
  NextServerResponse<ProcessResponse[]>
> {
  try {
    const response = await serverApi.get("/processes");

    return {
      success: true,
      data: response.data,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: "Hubo un problema con su registro, por favor intentelo más tarde.",
    };
  }
}

export async function deactivateProcess(
  id: string,
  data: ProcessDeactivationRequest,
): Promise<NextServerResponse<any>> {
  const { reason } = data;
  try {
    await serverApi.patch(`/processes/${id}/deactivate`, { reason });

    return {
      success: true,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: "Hubo un problema al desactivar el proceso.",
    };
  }
}
