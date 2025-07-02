import { useMutation } from "@tanstack/react-query";
import { post } from "../../../../services/apiService";
import AlertDialog from "../../../../utilities/Alert";
import { VERIFY_ACCOUNT_VERIFICATION_OTP } from "../../../../services/apiRoutes";
import { useNavigate } from "react-router-dom";
import {
  OtpVerificationResponse,
  VerifyOTPForSignupFormData,
} from "../types/VerifyOTPForSignupTypes";

export const useVerifyOTPForSignupMutation = () => {
  const navigate = useNavigate();
  const emailAddress = localStorage.getItem("emailAddress");
  const userId = localStorage.getItem("userId");
  return useMutation<
    OtpVerificationResponse,
    Error,
    VerifyOTPForSignupFormData
  >({
    mutationFn: async (data: VerifyOTPForSignupFormData) => {
      const response = await post(VERIFY_ACCOUNT_VERIFICATION_OTP, {
        emailAddress: emailAddress,
        otpCode: data.otpCode,
        userId: userId,
      });
      return response;
    },
    onSuccess: (data: OtpVerificationResponse) => {
      AlertDialog({
        title: "",
        text: data.message,
        icon: "success",
        timer: 1500,
      });

      localStorage.removeItem("userId");
      localStorage.removeItem("emailAddress");
      navigate("/login");
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
