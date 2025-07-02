import { useMutation } from "@tanstack/react-query";
import { post } from "../../../../services/apiService";
import AlertDialog from "../../../../utilities/Alert";
import {
  ApiResponse,
  SendOTPData,
  SendOTPDataResponse,
  SignupFormData,
} from "../types/SignupTypes";
import {
  REGISTER,
  SEND_ACCOUNT_VERIFICATION_OTP,
} from "../../../../services/apiRoutes";
import { useNavigate } from "react-router-dom";

export const useSignupMutation = () => {
  const sendOTPMutation = useSendAccountVerificationOTPMutation(); // Use the OTP mutation hook

  return useMutation<ApiResponse, Error, SignupFormData>({
    mutationFn: async (credentials: SignupFormData) => {
      const response = await post(REGISTER, credentials);
      return response;
    },
    onSuccess: (data: ApiResponse) => {
      AlertDialog({
        title: "",
        text: data.message,
        icon: "success",
        timer: 1500,
      });

      localStorage.setItem("userId", data.data._id);
      localStorage.setItem("emailAddress", data.data.emailAddress);

      // Trigger the OTP mutation
      sendOTPMutation.mutate({
        userId: data.data._id,
        emailAddress: data.data.emailAddress,
      });
    },
    onError: (error: Error) => {
      AlertDialog({
        title: "",
        text: error.message || "Something went wrong",
        icon: "error",
        timer: 2000,
      });
    },
  });
};

export const useSendAccountVerificationOTPMutation = () => {
  const navigate = useNavigate();
  return useMutation<SendOTPDataResponse, Error, SendOTPData>({
    mutationFn: async (data: SendOTPData) => {
      const response = await post(SEND_ACCOUNT_VERIFICATION_OTP, data);
      return response;
    },
    onSuccess: (data: SendOTPDataResponse) => {
      AlertDialog({
        title: "",
        text: data.message,
        icon: "success",
        timer: 1500,
      });
      navigate("/verify-otp-for-signup");
    },
    onError: (error: Error) => {
      AlertDialog({
        title: "",
        text: error.message || "Something went wrong",
        icon: "error",
        timer: 2000,
      });
    },
  });
};
