import { baseApi } from "../../utils/apiBaseQuery";


export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    AllCampaignData: builder.query({
      query: () => ({
        url: `/campaign`,
        method: 'GET',
      }),
    }),

    AllOrganizationData: builder.query({
      query: () => ({
        url: `/campaign`,
        method: 'GET',
      }),
    }),

    getContent: builder.query({
      query: () => ({
        url: `/content`,
        method: 'GET',
      }),
    }),

    createContent: builder.mutation({
      query: (data) => ({
        url: `/content`,
        method: 'PUT',
        body: data
      }),
    }),

  }),
});

// Export hooks
export const {
  useAllCampaignDataQuery,
  useAllOrganizationDataQuery,
  useCreateContentMutation,
  useGetContentQuery
} = settingsApi;
