"use server";

import { serverApi } from "@/infrastructure/lib/api/server-api";
import { NextServerResponse } from "@/interfaces";

export async function uploadFile(
  folderId: string,
  formData: FormData,
): Promise<NextServerResponse<any>> {
  try {
    const { data } = await serverApi.post(`/folder/${folderId}/file`, formData);

    return {
      success: true,
      message: "El archivo ha sido subido correctamente.",
      data,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: "Hubo un problema al subir el archivo.",
    };
  }
}

export async function deleteFile(
  fileId: string,
): Promise<NextServerResponse<any>> {
  try {
    const { data } = await serverApi.delete(`/folder/file/${fileId}`);

    return {
      success: true,
      message: "El archivo ha sido eliminado correctamente.",
      data,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: "Hubo un problema al eliminar el archivo.",
    };
  }
}
