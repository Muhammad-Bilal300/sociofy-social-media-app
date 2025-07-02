export interface LoginFormData {
  emailAddress: string;
  password: string;
}

export interface ApiResponse {
  data: {
    authToken: string;
  };
  message: string;
}
