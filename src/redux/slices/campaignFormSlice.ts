import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OrganizationFormData } from "@/components/campaign/newCampaign/forms/OrganizationInformationForm";
import { ContactPersonFormData } from "@/components/campaign/newCampaign/forms/ContactPersonForm";
import { AboutTheCauseFormData } from "@/components/campaign/newCampaign/forms/AboutTheCauseForm";
import { CampaignSettingsFormData } from "@/components/campaign/newCampaign/forms/CampaignSettingsForm";
import { DonationRoutingFormData } from "@/components/campaign/newCampaign/forms/DonationRoutingForm";

interface CampaignFormState {
  currentStep: number;
  formData: Record<
    string,
    | OrganizationFormData
    | ContactPersonFormData
    | AboutTheCauseFormData
    | CampaignSettingsFormData
    | DonationRoutingFormData
    | Record<string, unknown>
  >;
}

const initialState: CampaignFormState = {
  currentStep: 1,
  formData: {},
};

const campaignFormSlice = createSlice({
  name: "campaignForm",
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setOrganizationData: (
      state,
      action: PayloadAction<OrganizationFormData>
    ) => {
      state.formData.organization = action.payload;
    },
    setContactData: (state, action: PayloadAction<ContactPersonFormData>) => {
      state.formData.contact = action.payload;
    },
    setCauseData: (state, action: PayloadAction<AboutTheCauseFormData>) => {
      state.formData.cause = action.payload;
    },
    setSettingsData: (
      state,
      action: PayloadAction<CampaignSettingsFormData>
    ) => {
      state.formData.settings = action.payload;
    },
    setRoutingData: (state, action: PayloadAction<DonationRoutingFormData>) => {
      state.formData.routing = action.payload;
    },
    updateFormData: (
      state,
      action: PayloadAction<{
        stepId: string;
        data:
          | OrganizationFormData
          | ContactPersonFormData
          | AboutTheCauseFormData
          | CampaignSettingsFormData
          | DonationRoutingFormData
          | Record<string, unknown>;
      }>
    ) => {
      const { stepId, data } = action.payload;
      state.formData[stepId] = data;
    },
    resetCampaignForm: (state) => {
      state.currentStep = 1;
      state.formData = {};
    },
  },
});

export const {
  setCurrentStep,
  setOrganizationData,
  setContactData,
  setCauseData,
  setSettingsData,
  setRoutingData,
  updateFormData,
  resetCampaignForm,
} = campaignFormSlice.actions;

export default campaignFormSlice.reducer;
