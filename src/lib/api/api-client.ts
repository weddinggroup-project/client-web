import { fetchApi, type FetchApiOptions } from "./fetch-api";

type Options = Omit<FetchApiOptions, "method" | "body">;

export const apiClient = {
  get<T>(url: string, options?: Options) {
    return fetchApi<T>(url, { ...options, method: "GET" });
  },
  post<T>(url: string, body?: unknown, options?: Options) {
    return fetchApi<T>(url, { ...options, method: "POST", body });
  },
  put<T>(url: string, body?: unknown, options?: Options) {
    return fetchApi<T>(url, { ...options, method: "PUT", body });
  },
  patch<T>(url: string, body?: unknown, options?: Options) {
    return fetchApi<T>(url, { ...options, method: "PATCH", body });
  },
  delete<T>(url: string, options?: Options) {
    return fetchApi<T>(url, { ...options, method: "DELETE" });
  },
};
