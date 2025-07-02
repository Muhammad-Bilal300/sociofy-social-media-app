import { useMutation } from "@tanstack/react-query";
import { post } from "../../../../services/apiService";
import AlertDialog from "../../../../utilities/Alert";
import { useNavigate } from "react-router-dom";
import { ApiResponse, ResetPasswordData } from "../types/ResetPasswordTypes";
import { RESET_PASSWORD } from "../../../../services/apiRoutes";

export const useResetPasswordMutation = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  return useMutation<ApiResponse, Error, ResetPasswordData>({
    mutationFn: async (data: ResetPasswordData) => {
      const response = await post(RESET_PASSWORD, {
        userId: userId,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      });
      return response;
    },
    onSuccess: (data: ApiResponse) => {
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

