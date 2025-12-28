import { baseApi } from "../../utils/apiBaseQuery";


export const overviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    overviewData: builder.query({
      query: (year) => ({
        url: year ? `/dashboard?year=${year}` : '/dashboard',
        method: 'GET',
      }),
    }),



  }),
});

// Export hooks
export const {
  useOverviewDataQuery,
} = overviewApi;
