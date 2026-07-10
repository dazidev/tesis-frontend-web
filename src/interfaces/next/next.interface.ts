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
