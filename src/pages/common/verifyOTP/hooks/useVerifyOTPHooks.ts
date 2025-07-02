import { useMutation } from "@tanstack/react-query";
import { post } from "../../../../services/apiService";
import AlertDialog from "../../../../utilities/Alert";
import { VERIFY_OTP } from "../../../../services/apiRoutes";
import { useNavigate } from "react-router-dom";
import {
  OtpVerificationResponse,
  VerifyOTPData,
} from "../types/VerifyOTPTypes";

export const useVerifyOTPMutation = () => {
  const navigate = useNavigate();
  const emailAddress = localStorage.getItem("emailAddress");
  const userId = localStorage.getItem("userId");
  return useMutation<OtpVerificationResponse, Error, VerifyOTPData>({
    mutationFn: async (data: VerifyOTPData) => {
      const response = await post(VERIFY_OTP, {
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
      navigate("/reset-password");
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
