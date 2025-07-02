export interface SignupFormData {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  gender: string;
}

export interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  statusMessage: string;
  data: any;
}

export interface SendOTPData {
  emailAddress: string;
  userId: string;
}

export interface SendOTPDataResponse {
  success: boolean;
  statusCode: number;
  message: string;
  statusMessage: string;
  data: null;
}
