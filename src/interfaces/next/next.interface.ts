export interface NextServerResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
