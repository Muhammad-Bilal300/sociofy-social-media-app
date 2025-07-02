export interface ForgotPasswordCheckEmailFormData {
  emailAddress: string;
}

export interface ForgotPasswordSendOTPData {
  emailAddress: string;
  userId: string;
}


export interface ForgotPasswordCheckEmailApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  statusMessage: string;
  data: {
    _id: string;
    emailAddress: string;
  };
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
