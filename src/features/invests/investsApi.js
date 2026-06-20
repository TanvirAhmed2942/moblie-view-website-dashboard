import { baseApi } from "../../utils/apiBaseQuery";

export const investSApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInvest: builder.query({
      query: ({page , campaignId}) => ({
        url: `/invitation-history?campaignId=${campaignId}&page=${page}`,
        method: 'GET',
      }),
      providesTags: ['invests'],
    }),

  }),
});

export const {
  useGetInvestQuery,
} = investSApi;