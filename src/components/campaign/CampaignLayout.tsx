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

      <div className='flex justify-end pb-2'>
        <button className='bg-purple-600 text-white px-4 cursor-pointer py-1.5 text-sm rounded-sm shadow' onClick={handleAddCampaign}>Add Campaign</button>
      </div>
      <CampaignListTable />

    </div>
  );
}

export default CampaignLayout;
