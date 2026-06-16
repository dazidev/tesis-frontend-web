export type UserRole = "admin" | "lawyer" | "client";

export const userRoleLabels: Record<UserRole, string> = {
  admin: "Administrador",
  lawyer: "Abogado",
  client: "Cliente",
};

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

export interface UserResponse {
  id: string;
  name: string;
  lastname: string;
  email: string;
  roles: UserRole;
  status: UserStatus;
  lawyerId?: string;
}

export interface UserInvitationResponse {
  invitationLink: string;
}

export interface GetUserInvitationResponse {
  toEmail: string;
  role: UserRole;
  id: string;
  expiresAt: Date;
  isUsed: boolean;
}
