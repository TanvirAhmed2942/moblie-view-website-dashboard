import { baseApi } from "../../utils/apiBaseQuery";


export const privacyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    AllPrivacy: builder.query({
      query: () => ({
        url: `/privacy-policy`,
        method: 'GET',
      }),
    }),
    getSinglePrivacy: builder.query({
      query: (id) => ({
        url: `/privacy-policy/${id}`,
        method: 'GET',
      }),
    }),

    createPrivacy: builder.mutation({
      query: (data) => ({
        url: `/privacy-policy`,
        method: 'PUT',
        body: data
      }),
    }),

    updatePrivacy: builder.mutation({
      query: ({ data, id }) => ({
        url: `/privacy-policy/${id}`,
        method: 'PATCH',
        body: data
      }),
    }),

    deletePrivacy: builder.mutation({
      query: (id) => ({
        url: `/privacy-policy/${id}`,
        method: 'DELETE',
      }),
    }),


  }),
});

// Export hooks
export const {
  useAllPrivacyQuery,
  useGetSinglePrivacyQuery,
  useCreatePrivacyMutation,
  useUpdatePrivacyMutation,
  useDeletePrivacyMutation
} = privacyApi;
