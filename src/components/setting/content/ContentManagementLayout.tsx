import React from "react";
import AboutUs from "./AboutUs";
import PrivacyPolicyFaq from "./PrivacyPolicyFaq";

function ContentManagementLayout() {
  return (
    <div className="space-y-6">
      <AboutUs />
      <PrivacyPolicyFaq />
    </div>
  );
}

export default ContentManagementLayout;
