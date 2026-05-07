import { DefaultSession } from "next-auth";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    lastname: string;
    roles: string[];
    status: string;

    accessToken: string;
    refreshToken: string;
    sessionId: string;

    accessTokenExpiresIn: number;
    refreshTokenExpiresIn: number;
  }

  interface Session {
    accessToken?: string;
    error?: string;
    user: DefaultSession["user"] & {
      id: string;
      email: string;
      name: string;
      lastname: string;
      roles: string[];
      status: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      id: string;
      email: string;
      name: string;
      lastname: string;
      roles: string[];
      status: string;
    };

    accessToken?: string;
    refreshToken?: string;
    sessionId?: string;

    accessTokenExpiresAt?: number;
    refreshTokenExpiresAt?: number;

    error?: string;
  }
}
