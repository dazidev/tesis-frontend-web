"use server";
import { serverApi } from "@/infrastructure/lib/api/server-api";
import {
  CreateFolderRequest,
  FolderResponse,
  GetFolderRequest,
  NextServerResponse,
} from "@/interfaces";

export async function createFolder(
  data: CreateFolderRequest,
  stageId: string,
): Promise<NextServerResponse<FolderResponse>> {
  try {
    const response = await serverApi.post(`/folder/${stageId}`, data);

    return {
      success: true,
      data: response.data,
      message: "La carpeta ha sido creada correctamente.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: "Hubo un problema al crear la carpeta.",
    };
  }
}

export async function getFolders(
  stageId: string,
  data?: GetFolderRequest,
): Promise<NextServerResponse<any>> {
  try {
    await serverApi.get(`/folder/${stageId}`, {
      params: data,
    });

    return {
      success: true,
      message: "Las carpetas han sido obtenidas correctamente.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: "Hubo un problema al obtener las carpetas.",
    };
  }
}
