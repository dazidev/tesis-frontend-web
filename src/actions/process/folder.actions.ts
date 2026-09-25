"use server";
import { serverApi } from "@/infrastructure/lib/api/server-api";
import {
  CreateFolderRequest,
  FolderDeactivationRequest,
  FolderResponse,
  GetFolderRequest,
  NextServerResponse,
  UpdateFolderRequest,
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

export async function getFolder(
  id: string,
): Promise<NextServerResponse<FolderResponse>> {
  try {
    const response = await serverApi.get(`/folder/${id}`);

    return {
      success: true,
      data: response.data,
      message: "Las carpetas han sido obtenidas correctamente.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: "Hubo un problema al obtener las carpetas.",
    };
  }
}

export async function updateFolder(
  folderId: string,
  data: UpdateFolderRequest,
): Promise<NextServerResponse<FolderResponse>> {
  try {
    const response = await serverApi.patch(`/folder/${folderId}`, data);

    return {
      success: true,
      data: response.data,
      message: "La carpeta ha sido actualizada correctamente.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: "Hubo un problema al actualizar la carpeta.",
    };
  }
}

export async function deleteFolder(
  folderId: string,
  data: FolderDeactivationRequest,
): Promise<NextServerResponse<any>> {
  try {
    const response = await serverApi.patch(
      `/folder/${folderId}/deactivate`,
      data,
    );

    return {
      success: true,
      data: response.data,
      message: "La carpeta ha sido eliminada correctamente.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: "Hubo un problema al eliminar la carpeta.",
    };
  }
}
