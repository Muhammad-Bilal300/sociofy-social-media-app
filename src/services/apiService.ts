// apiService.ts
import axios, { AxiosRequestConfig, Method } from "axios";
import baseUrl from "./baseUrl";
import AlertDialog from "../utilities/Alert";

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

type ApiService = (
  url: string,
  method: Method,
  body?: any,
  token?: string | null
) => Promise<any>;

// Generic API service function
export const apiService: ApiService = async (
  url,
  method,
  body = null,
  token = null
) => {
  let attempt = 0;
  const maxRetries = 1;

  while (attempt <= maxRetries) {
    try {
      const config: AxiosRequestConfig = {
        method,
        url,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      };

      if (body instanceof FormData) {
        config.headers!["Content-Type"] = "multipart/form-data";
        config.data = body;
      } else if (body) {
        config.headers!["Content-Type"] = "application/json";
        config.data = body;
      }

      const response = await axiosInstance(config);
      return response.data;
    } catch (error: any) {
      if (attempt < maxRetries) {
        attempt++;
        continue; // Retry the request once
      } else {
        // Handle errors as before
        if (error.response) {
          AlertDialog({
            title: "",
            text: error.response.data.message || error.response.statusText,
            icon: "error",
            timer: 1500,
          });
          throw new Error(
            error.response.data.message || error.response.statusText
          );
        } else if (error.request) {
          AlertDialog({
            title: "",
            text: "No response received from the server",
            icon: "error",
            timer: 1500,
          });
          throw new Error("No response received from the server");
        } else {
          AlertDialog({
            title: "",
            text: error.message || "Something went wrong",
            icon: "error",
            timer: 1500,
          });
          throw new Error(error.message || "Something went wrong");
        }
      }
    }
  }

  throw new Error("API call failed after retrying");
};

// Helper methods with appropriate typing
export const get = (url: string, token?: string | null) =>
  apiService(url, "GET", null, token);

export const post = <T = any>(url: string, body: T, token?: string) =>
  apiService(url, "POST", body, token);

export const put = <T = any>(url: string, body: T, token?: string) =>
  apiService(url, "PUT", body, token);

export const patch = (url: string, body: FormData, token?: string) =>
  apiService(url, "PATCH", body, token);

export const del = (url: string, token?: string) =>
  apiService(url, "DELETE", null, token);
