import { baseApi } from "../../utils/apiBaseQuery";

export const donorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get donors with pagination
    getDonor: builder.query({
      query: (page) => ({
        url: `/users/all?totalDonated[gt]=0&page=${page}&limit=10`,
        method: 'GET',
      }),
      providesTags: ['donors'],
    }),

    // Get donor details with separate pagination for invitations and transactions
    getDonorDetails: builder.query({
      query: ({ id, page = 1, iPage = 1 }) => {
        const params = new URLSearchParams();

        // Use iPage for invitations (Invitee List)
        if (iPage) params.append('iPage', String(iPage));
        // Use page for transactions (Donation History)
        if (page) params.append('page', String(page));

        params.append('iLimit', '5');
        params.append('limit', '5');

        return {
          url: `/transactions/user/${id}?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['donors'],
    }),
  }),
});

export const {
  useGetDonorQuery,
  useGetDonorDetailsQuery
} = donorApi;