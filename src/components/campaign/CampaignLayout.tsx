"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import CampaignListTable from "./CampaignListTable";
import ExistingCampaignDetailsTable from "./ExistingCampaignDetailsTable";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
function CampaignLayout() {
  const router = useRouter();
  const handleAddCampaign = () => {
    router.push("/campaigns/new-campaign");
  };
  return (
    <div>
      <Tabs defaultValue="list">
        <div className="flex items-center justify-end">
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={handleAddCampaign}
          >
            <Plus />
            Add Campaign
          </Button>
        </div>
        <TabsList>
          <TabsTrigger
            value="list"
            className="text-gray-900 data-[state=active]:bg-purple-700 data-[state=active]:text-white"
          >
            Campaign List
          </TabsTrigger>
          <TabsTrigger
            value="details"
            className="text-gray-900 data-[state=active]:bg-purple-700 data-[state=active]:text-white"
          >
            Existing Campaign Details
          </TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <CampaignListTable />
        </TabsContent>
        <TabsContent value="details">
          <ExistingCampaignDetailsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CampaignLayout;
