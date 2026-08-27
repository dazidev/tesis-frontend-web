"use server";

import { ProcessByIdResponse, ProcessResponse } from "@/interfaces";
import {
  CreateProcessRequest,
  CreateSubStageRequest,
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
      error: "Hubo un problema al cargar los procesos.",
    };
  }
}

export async function getProcess(
  processId: string,
): Promise<NextServerResponse<ProcessByIdResponse>> {
  try {
    const response = await serverApi.get(`/processes/${processId}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: "Hubo un problema al cargar el proceso.",
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

export async function createProcess(
  data: CreateProcessRequest,
): Promise<NextServerResponse<any>> {
  const { managedByID, ...dataWithoutManager } = data;

  let verifedData;

  if (!managedByID) {
    verifedData = dataWithoutManager;
  } else {
    verifedData = data;
  }

  try {
    await serverApi.post("/processes", verifedData);

    return {
      success: true,
      message: "El proceso ha sido creado correctamente.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: "Hubo un problema al crear el proceso.",
    };
  }
}

export async function initProcess(
  id: string,
): Promise<NextServerResponse<any>> {
  try {
    await serverApi.post(`/processes/${id}/init`);

    return {
      success: true,
      message: "El proceso ha sido iniciado correctamente.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: "Hubo un problema al iniciar el proceso.",
    };
  }
}

export async function createSubStage(
  data: CreateSubStageRequest,
  stageId: string,
): Promise<NextServerResponse<any>> {
  try {
    await serverApi.post(`/processes/stage/${stageId}`, data);

    return {
      success: true,
      message: "La subetapa ha sido creada correctamente.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: "Hubo un problema al crear la subetapa.",
    };
  }
}
