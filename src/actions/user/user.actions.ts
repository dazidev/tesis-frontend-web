import { serverApi } from "@/infrastructure/lib/api/server-api";
import { NextServerResponse, UserResponse } from "@/interfaces";

export async function getAllUsers(): Promise<
  NextServerResponse<UserResponse[]>
> {
  try {
    const users = await serverApi.get("/user");

    return {
      success: true,
      data: users.data,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: "Hubo un problema al cargar los usuarios.",
    };
  }
}
