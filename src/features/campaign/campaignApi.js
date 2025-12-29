import { baseApi } from "../../utils/apiBaseQuery";


export const overviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCampaign: builder.query({
      query: (searchTerm) => ({
        url: searchTerm ? `/campaign?searchTerm=${searchTerm}` : '/campaign',
        method: 'GET',
      }),
      providesTags: ['campaigns'],
    }),

    singleGetCampaign: builder.query({
      query: (id) => ({
        url: `/campaign/${id}`,
        method: 'GET',
      }),
      providesTags: ['campaigns'],
    }),

    createCampaign: builder.mutation({
      query: (data) => ({
        url: `/campaign`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['campaigns'],
    }),


    updateCampaign: builder.mutation({
      query: ({ data, id }) => ({
        url: `/campaign/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['campaigns'],
    }),


    deleteCampaign: builder.mutation({
      query: (id) => ({
        url: `/campaign/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['campaigns'],
    }),

    setAlertCampaign: builder.mutation({
      query: ({ id, data }) => ({
        url: `/campaign/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['campaigns'],
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
