import { baseApi } from "../../utils/apiBaseQuery";


export const overviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCampaign: builder.query({
      query: (searchTerm) => ({
        url: searchTerm ? `/campaign?searchTerm=${searchTerm}` : '/campaign',
        method: 'GET',
      }),
    }),

    singleGetCampaign: builder.query({
      query: (id) => ({
        url: `/campaign/${id}`,
        method: 'GET',
      }),
    }),

    createCampaign: builder.mutation({
      query: (data) => ({
        url: `/campaign`,
        method: 'POST',
        body: data
      }),
    }),


    updateCampaign: builder.mutation({
      query: ({ data, id }) => ({
        url: `/campaign/${id}`,
        method: 'PATCH',
        body: data
      }),
    }),


    deleteCampaign: builder.mutation({
      query: (id) => ({
        url: `/campaign/${id}`,
        method: 'DELETE',
      }),
    }),

    setAlertCampaign: builder.mutation({
      query: ({ id, data }) => ({
        url: `/campaign/${id}`,
        method: 'PATCH',
        body: data
      }),
    }),
  }),
});

// Export hooks
export const {
  useGetCampaignQuery,
  useSingleGetCampaignQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
  useSetAlertCampaignMutation
} = overviewApi;
