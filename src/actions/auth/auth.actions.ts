"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/infrastructure/lib/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

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
