import { baseApi } from "../../utils/apiBaseQuery";

export const downlineApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get donors with pagination
    getDownline: builder.query({
      query: (campaignId) => ({
        url: `/invitation-history/campaign-by-downline?campaignId=${campaignId}`,
        method: 'GET',
      }),
      providesTags: ['downline'],
    }),
  }),
});

export const {
  useGetDownlineQuery,
} = downlineApi;