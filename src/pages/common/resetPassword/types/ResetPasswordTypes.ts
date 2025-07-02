export interface ResetPasswordData {
  userId: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  statusMessage: string;
  data: unknown;
}
