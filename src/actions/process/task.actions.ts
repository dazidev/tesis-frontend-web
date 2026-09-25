"use server";

import { serverApi } from "@/infrastructure/lib/api/server-api";

import {
  CreateTaskRequest,
  NextServerResponse,
  TaskResponse,
} from "@/interfaces";

export async function createTask(
  stageId: string,
  data: CreateTaskRequest,
): Promise<NextServerResponse<TaskResponse>> {
  try {
    const response = await serverApi.post(`/task/${stageId}`, data);

    return {
      success: true,
      data: response.data,
      message: "La tarea ha sido creada correctamente.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: "Hubo un problema al crear la tarea.",
    };
  }
}
