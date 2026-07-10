"use server";

import { serverApi } from "@/infrastructure/lib/api/server-api";
import {
  NextServerResponse,
  UserDeactivationRequest,
  UserInvitationRequest,
  UserInvitationResponse,
} from "@/interfaces";
import { isAuthenticate } from "../auth/auth.actions";

export async function sendUserInvitation(
  data: UserInvitationRequest,
): Promise<NextServerResponse<UserInvitationResponse>> {
  try {
    const isAuth = await isAuthenticate();
    if (!isAuth.success) throw new Error(isAuth.error);

    const response = await serverApi.post("/admin/user-invitation", {
      ...data,
      createdById: isAuth.user?.id,
    });

    if (!response)
      throw new Error("Hubo un problema al generar la invitación.");

    return {
      success: true,
      data: response.data,
      message: "La invitación ha sido enviada correctamente.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: "Hubo un problema al generar la invitación.",
    };
  }
}

export async function deactivateUser(
  data: UserDeactivationRequest,
  userId: string,
): Promise<NextServerResponse<any>> {
  try {
    const isAuth = await isAuthenticate();
    if (!isAuth.success) throw new Error(isAuth.error);

    const response = await serverApi.patch(
      `/admin/users/${userId}/deactivate`,
      data,
    );

    if (!response)
      throw new Error("Hubo un problema al desactivar el usuario.");

    return {
      success: true,
      data: response.data,
      message: "El usuario ha sido desactivado correctamente.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: "Hubo un problema al desactivar el usuario.",
    };
  }
}
