import { useMutation } from "@tanstack/react-query";
import { ApiResponse, LoginFormData } from "../types/LoginTypes";
import { post } from "../../../../services/apiService";
import { LOGIN } from "../../../../services/apiRoutes";
import AlertDialog from "../../../../utilities/Alert";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../../../../utilities/Globals";
import { ROLES } from "../../../../constants/basic";

export const useLoginMutation = () => {
  const navigate = useNavigate();
  return useMutation<ApiResponse, Error, LoginFormData>({
    mutationFn: async (credentials: LoginFormData) => {
      const response = await post(LOGIN, credentials);
      return response;
    },
    onSuccess: (data: ApiResponse) => {
      localStorage.setItem("token", data.data.authToken);
      const role = getUserRole();
      if (role == ROLES.USER) {
        navigate("/");
      } else if (role == ROLES.ADMIN) {
        navigate("/admin");
      }
      navigate("/");
      AlertDialog({
        title: "",
        text: data.message,
        icon: "success",
        timer: 1500,
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
