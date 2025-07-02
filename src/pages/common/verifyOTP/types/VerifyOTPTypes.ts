export interface VerifyOTPData {
    emailAddress: string;
    userId: string;
    otpCode: string;
  }
  
  export interface OtpVerificationResponse {
    success: boolean;
    statusCode: number;
    message: string;
    statusMessage: string;
    data: null;
  }
  