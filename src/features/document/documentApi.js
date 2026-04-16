import { baseApi } from "../../utils/apiBaseQuery";


export const documentApi = baseApi.injectEndpoints({
    tagTypes: ['Document'],
    endpoints: (builder) => ({
        getTermsAndConditions: builder.query({
            query: () => ({
                url: `/setting?type=terms_condition`,
                method: 'GET',
            }),
            providesTags: ['Document'],
        }),
        getPrivacyPolicy: builder.query({
            query: () => ({
                url: `/setting?type=privacy_policy`,
                method: 'GET',
            }),
            providesTags: ['Document'],
        }),

        updatePrivacyPolicy: builder.mutation({
            query: (data) => ({
                url: `/setting`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Document'],
        }),

        updateTermsAndCondition: builder.mutation({
            query: (data) => ({
                url: `/setting`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Document'],
        }),
    }),
});

// Export hooks
export const {
    useGetTermsAndConditionsQuery,
    useGetPrivacyPolicyQuery,
    useUpdatePrivacyPolicyMutation,
    useUpdateTermsAndConditionMutation
} = documentApi;
