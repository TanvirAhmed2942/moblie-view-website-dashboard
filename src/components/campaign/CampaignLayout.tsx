"use client";
import { useRouter } from "next/navigation";
import CampaignListTable from "./CampaignListTable";
function CampaignLayout() {
  const router = useRouter();
  const handleAddCampaign = () => {
    router.push("/campaigns/new-campaign");
  };
  return (
    <div>


      <CampaignListTable />

    </div>
  );
}

export default CampaignLayout;
