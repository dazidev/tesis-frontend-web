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

export type StageStatus = "created" | "opened" | "closed";

export type SubstageStatus = "created" | "opened" | "closed";

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

export interface Defendant {
  id: string;
  createdAt: Date;
  name: string;
  lastname: string;
  birthDate: Date;
  deathDate: Date;
}

export interface SubstageNode {
  id: string;
  name: string;
  description: string;
  status: SubstageStatus;
  order: number;
  stageId: string;
  parentSubstageId: string | undefined;
  childrenSubstages: SubstageNode[];
}

export interface ProcessStage {
  id: string;
  name: string;
  description: string;
  order: number;
  status: StageStatus;
  main: boolean;
  childrenSubstages: SubstageNode[];
}

export interface ProcessByIdResponse {
  id: string;
  courtNumber: string;
  caseFileNumber: string;
  type: ProcessType;
  status: ProcessStatus;
  defendantId: string;
  defendant: Defendant;
  stages: ProcessStage[];
}
