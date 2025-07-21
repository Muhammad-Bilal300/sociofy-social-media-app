// useGetAllPostsQuery.ts
import { useQuery } from "@tanstack/react-query";
import { get } from "../../../../../../../../services/apiService";
import { GET_ALL_POSTS } from "../../../../../../../../services/apiRoutes";
import { getUserToken } from "../../../../../../../../utilities/Globals";

export const useGetAllPostsQuery = () => {
  return useQuery({
    queryKey: ["allPosts"],

    queryFn: async () => {
      const response = await get(GET_ALL_POSTS, getUserToken() ?? undefined);
      return response;
    },
  });
};
