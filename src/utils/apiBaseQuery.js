import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "./BaseURL";
import { getToken } from "./storage";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseURL}/api/v1`,
    prepareHeaders: (headers, { extra }) => {
      const token = getToken();

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      // ❗ Detect FormData
      const isFormData =
        extra instanceof FormData ||
        headers.get("Content-Type") === "multipart/form-data";

      // ❗ Only set JSON content-type if NOT FormData
      if (!isFormData && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }

      return headers;
    },
  }),
  tagTypes: ["donors", "campaigns", "downline"],
  endpoints: () => ({}),
});
