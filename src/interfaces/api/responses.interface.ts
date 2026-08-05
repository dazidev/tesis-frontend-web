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

export interface UserBasicResponse {
  id: string;
  name: string;
  lastname: string;
  email: string;
  roles: UserRole;
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

//* processes

export type ProcessType = "testate" | "intestate" | "mixed";

export type ProcessStatus = "created" | "opened" | "closed" | "deleted";

export interface ProcessResponse {
  id: string;
  courtNumber: string;
  caseFileNumber: string;
  type: ProcessType;
  status: ProcessStatus;
  defendantId: string;
  managedByID: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}
