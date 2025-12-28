import { baseApi } from "../../utils/apiBaseQuery";


export const donationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    getDonations: builder.query({
      query: (page) => ({
        url: `/transactions?page=${page}&limit=10`,
        method: 'GET',
      }),
    }),


    getSingleDonationsDetails: builder.query({
      query: (id) => ({
        url: `/transactions/${id}`,
        method: 'GET',
      }),
    }),

    sendMessage: builder.mutation({
      query: ({ id, data }) => ({
        url: `/transactions/send-success-message/${id}`,
        method: 'POST',
        body: data // {  "message": "23456789oiuytdxcvbnm" }
      }),
    }),

  }),
});

// Export hooks
export const {
  useGetDonationsQuery,
  useGetSingleDonationsDetailsQuery,
  useSendMessageMutation
} = donationsApi;
