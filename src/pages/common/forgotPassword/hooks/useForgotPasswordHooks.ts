import { useMutation } from "@tanstack/react-query";
import { post } from "../../../../services/apiService";
import AlertDialog from "../../../../utilities/Alert";
import { CHECK_USER_EMAIL, SEND_VERIFICATION_OTP } from "../../../../services/apiRoutes";
import { useNavigate } from "react-router-dom";
import {
  ForgotPasswordCheckEmailApiResponse,
  ForgotPasswordCheckEmailFormData,
  SendOTPData,
  SendOTPDataResponse,
} from "../types/ForgotPasswordTypes";

export const useCheckUserEmailMutation = () => {
  const sendOTPMutation = useSendOTPMutation(); // Use the OTP mutation hook

  return useMutation<
    ForgotPasswordCheckEmailApiResponse,
    Error,
    ForgotPasswordCheckEmailFormData
  >({
    mutationFn: async (data: ForgotPasswordCheckEmailFormData) => {
      const response = await post(CHECK_USER_EMAIL, data);
      return response;
    },
    onSuccess: (data: ForgotPasswordCheckEmailApiResponse) => {
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

export const useSendOTPMutation = () => {
  const navigate = useNavigate();
  return useMutation<SendOTPDataResponse, Error, SendOTPData>({
    mutationFn: async (data: SendOTPData) => {
      const response = await post(SEND_VERIFICATION_OTP, data);
      return response;
    },
    onSuccess: (data: SendOTPDataResponse) => {
      AlertDialog({
        title: "",
        text: data.message,
        icon: "success",
        timer: 1500,
      });
      navigate("/verify-otp");
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
