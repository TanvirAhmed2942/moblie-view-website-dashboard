import { baseApi } from "../../utils/apiBaseQuery";

export const donorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDonor: builder.query({
      query: ({ page, campaignId }) => ({
        url: `/donate?campaignId=${campaignId}&page=${page}`,
        method: 'GET',
      }),
      providesTags: ['donors'],
    }),

  }),
});

export const {
  useGetDonorQuery,
} = donorApi;