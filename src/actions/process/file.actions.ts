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

export async function viewFile(
  fileId: string,
): Promise<NextServerResponse<ArrayBuffer>> {
  try {
    const response = await serverApi.get(`/folder/file/${fileId}/view`, {
      responseType: "arraybuffer",
    });

    return {
      success: true,
      message: "Archivo obtenido correctamente.",
      data: response.data,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: "Hubo un problema al obtener el archivo.",
    };
  }
}

export async function downloadFile(fileId: string): Promise<
  NextServerResponse<{
    buffer: ArrayBuffer;
    filename: string;
  }>
> {
  try {
    const response = await serverApi.get(`/folder/file/${fileId}/download`, {
      responseType: "arraybuffer",
    });

    const contentDisposition = response.headers["content-disposition"];

    let filename = "documento.pdf";

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="([^"]+)"/);

      if (match?.[1]) {
        filename = match[1];
      }
    }

    return {
      success: true,
      message: "Archivo obtenido correctamente.",
      data: {
        buffer: response.data,
        filename,
      },
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: "Hubo un problema al descargar el archivo.",
    };
  }
}
