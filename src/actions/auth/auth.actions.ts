"use server";

import { AuthError } from "next-auth";
import { auth, signIn, signOut } from "@/infrastructure/lib/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import {
  GetUserInvitationResponse,
  NextServerAuthResponse,
  NextServerResponse,
  RegisterUserRequest,
} from "@/interfaces";
import { serverApi } from "@/infrastructure/lib/api/server-api";

interface Data {
  email: string;
  password: string;
  deviceId: string;
  deviceInfo: string;
}

export async function authenticate(data: Data) {
  try {
    const { email, password, deviceId, deviceInfo } = data;

    await signIn("credentials", {
      email,
      password,
      deviceId,
      deviceInfo,
      redirectTo: "/panel",
    });
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return {
          ok: false,
          message: "Credenciales inválidas.",
        };
      }

      return {
        ok: false,
        message: "Algo salió mal.",
      };
    }

    throw error;
  }
}

export const logout = async () => {
  await signOut({
    redirectTo: "/auth/login",
  });
};

export async function isAuthenticate(): Promise<NextServerAuthResponse> {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      error: "No autorizado",
    };
  }

  return {
    success: true,
    user: session.user,
  };
}

export async function getUserInvitation(
  token: string,
): Promise<NextServerResponse<GetUserInvitationResponse>> {
  try {
    const response = await serverApi.get(`/auth/invitation/${token}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: "Hubo un problema al generar la invitación.",
    };
  }
}

export async function registerUser(
  data: RegisterUserRequest,
): Promise<NextServerResponse<any>> {
  try {
    await serverApi.post("/auth/register-user", data);

    return {
      success: true,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: "Hubo un problema con su registro, por favor intentelo más tarde.",
    };
  }
}
