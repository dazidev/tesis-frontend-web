"use server";

import { serverApi } from "@/infrastructure/lib/api/server-api";

import {
  CreateTaskRequest,
  NextServerResponse,
  TaskDeactivationRequest,
  TaskResponse,
  UpdateTaskCompletionRequest,
  UpdateTaskRequest,
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

export async function updateTaskCompletion(
  taskId: string,
  data: UpdateTaskCompletionRequest,
): Promise<NextServerResponse<TaskResponse>> {
  try {
    const response = await serverApi.patch(`/task/${taskId}/completion`, data);

    return {
      success: true,
      data: response.data,
      message: data.completed
        ? "La tarea ha sido completada correctamente."
        : "La tarea ha sido reabierta correctamente.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: "Hubo un problema al actualizar la tarea.",
    };
  }
}

export async function updateTask(
  taskId: string,
  data: UpdateTaskRequest,
): Promise<NextServerResponse<TaskResponse>> {
  try {
    const response = await serverApi.patch(`/task/${taskId}`, data);

    return {
      success: true,
      data: response.data,
      message: "La tarea ha sido actualizada correctamente.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: "Hubo un problema al actualizar la tarea.",
    };
  }
}

export async function deactivateTask(
  taskId: string,
  data: TaskDeactivationRequest,
): Promise<NextServerResponse<TaskResponse>> {
  try {
    const response = await serverApi.patch(`/task/${taskId}/deactivate`, data);

    return {
      success: true,
      data: response.data,
      message: "La tarea ha sido eliminada correctamente.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: "Hubo un problema al eliminar la tarea.",
    };
  }
}
