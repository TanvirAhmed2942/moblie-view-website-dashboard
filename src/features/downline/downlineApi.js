import { baseApi } from "../../utils/apiBaseQuery";

export const downlineApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get donors with pagination
    getDownline: builder.query({
      query: () => ({
        url: `/content/user-level-strategies`,
        method: 'GET',
      }),
      providesTags: ['downline'],
    }),

    createDownline: builder.mutation({
      query: (data) => ({
        url: `/content/user-level-strategies`,
        method: 'POST',
        body: data
      }),
      providesTags: ['downline'],
    }),

    updateDownline: builder.mutation({
      query: ({ id, data }) => ({
        url: `/content/user-level-strategies/${id}`,
        method: 'PUT',
        body: data
      }),
      providesTags: ['downline'],
    }),

    deleteDownline: builder.mutation({
      query: (id) => ({
        url: `/content/user-level-strategies/${id}`,
        method: 'DELETE',
      }),
      providesTags: ['downline'],
    }),

  }),
});

export const {
  useGetDownlineQuery,
  useCreateDownlineMutation,
  useUpdateDownlineMutation,
  useDeleteDownlineMutation
} = downlineApi;