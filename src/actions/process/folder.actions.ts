"use server";
import { serverApi } from "@/infrastructure/lib/api/server-api";
import { CreateFolderRequest, NextServerResponse } from "@/interfaces";

export async function createFolder(
  data: CreateFolderRequest,
  stageId: string,
): Promise<NextServerResponse<any>> {
  try {
    await serverApi.post(`/folder/${stageId}`, data);

    return {
      success: true,
      message: "El folder ha sido creado correctamente.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: "Hubo un problema al crear el folder.",
    };
  }
}
