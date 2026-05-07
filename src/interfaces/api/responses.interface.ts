export type UserRole = "admin" | "lawyer" | "client";
export type UserStatus = "active" | "inactive" | "suspended";

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    lastname: string;
    roles: UserRole[];
    status: UserStatus;
    lawyerId: string | null;
  };
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
  sessionId: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken?: string;
  accessTokenExpiresIn: number; // seconds
  refreshTokenExpiresIn?: number; // seconds
}
