import React from "react";
import { TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import DonorListTable from "./DonorListTable";
import SeedDonorListTable from "./SeedDonorListTable";
import { Tabs } from "../ui/tabs";
function DonorSeedListLayout() {
  return (
    <div>
      <Tabs defaultValue="donor">
        <TabsList>
          <TabsTrigger
            value="donor"
            className="text-gray-900 data-[state=active]:bg-purple-700 data-[state=active]:text-white"
          >
            Donor
          </TabsTrigger>
          <TabsTrigger
            value="seed"
            className="text-gray-900 data-[state=active]:bg-purple-700 data-[state=active]:text-white"
          >
            Seed
          </TabsTrigger>
        </TabsList>
        <TabsContent value="donor">
          <DonorListTable />
        </TabsContent>
        <TabsContent value="seed">
          <SeedDonorListTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default DonorSeedListLayout;
