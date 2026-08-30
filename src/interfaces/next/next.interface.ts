import { User } from "next-auth";
import { UserRole } from "../api/responses.interface";

export interface NextServerAuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface NextServerResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UserInvitationRequest {
  toEmail: string;
  role: UserRole;
}

export interface RegisterUserRequest {
  name: string;
  lastname: string;
  password: string;
  invitationId: string;
}

export interface UserDeactivationRequest {
  type: string;
  reason: string;
}

interface DeactivationRequest {
  reason: string;
}

export interface ProcessDeactivationRequest extends DeactivationRequest {}

export interface StageDeactivationRequest extends DeactivationRequest {}

export interface SubStageDeactivationRequest extends DeactivationRequest {}

export interface CreateProcessRequest {
  courtNumber: string;
  caseFileNumber: string;
  type: string;
  managedByID: string;
  defendant: {
    name: string;
    lastname: string;
    birthDate: Date | null;
    deathDate: Date | null;
  };
}

export interface CreateSubStageRequest {
  name: string;
  description: string;
  parentSubstageId?: string;
}
