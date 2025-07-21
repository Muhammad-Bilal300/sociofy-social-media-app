// useAddPostMutation.ts
import { useMutation } from "@tanstack/react-query";
import { post } from "../../../../../../../../../../services/apiService";
import { AddPostFormData, AddPostResponse } from "../types/AddPostTypes";
import { ADD_POST } from "../../../../../../../../../../services/apiRoutes";
import { getUserToken } from "../../../../../../../../../../utilities/Globals";

export const useAddPostMutation = () => {
  return useMutation<AddPostResponse, Error, AddPostFormData>({
    mutationFn: async (data: AddPostFormData) => {
      const formData = new FormData();

      formData.append("description", data.description);
      formData.append("postStatus", data.postStatus || "PUBLIC");
      if (data.feeling) formData.append("feeling", data.feeling);
      if (data.location) formData.append("location", data.location);
      if (data.locationCoords) {
        formData.append("locationCoords[]", String(data.locationCoords[0]));
        formData.append("locationCoords[]", String(data.locationCoords[1]));
      }

      if (data.files && data.files.length > 0) {
        data.files.forEach((file) => {
          formData.append("files", file); // backend must accept array name: files[]
        });
      }

      const response = await post(
        ADD_POST,
        formData,
        getUserToken() ?? undefined
      );

      return response;
    },
  });
};
