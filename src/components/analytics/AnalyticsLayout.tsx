"use client";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

import ActiveCampaignChart from "./ActiveCampaignChart";
import { MdCalendarMonth } from "react-icons/md";
import ExistingCampaignTable from "./ExistingCampaignTable";
function AnalyticsLayout() {
  const stats = [
    {
      icon: "campaigns",
      title: "Total Funds Raised",
      value: "$34,565.50",
      growth: "+13% this month",
    },
    {
      icon: "donors",
      title: "Total Donors",
      value: "15,324",
      growth: "+9.8% this month",
    },
    {
      icon: "success",
      title: "Active Campaigns",
      value: "23",
      growth: "+2 since last month",
    },
    {
      icon: "Total Invitees",
      title: "23,123",
      value: "$100,000",
      growth: "80% acceptance rate",
    },
  ];

  const timeline = ["Last 7 days", "Last 30 days", "This Quarter", "This Year"];
  return (
    <div className="space-y-4 min-w-0">
      <div>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-sm text-gray-500">
          Here is an overview of your analytics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <div className=" w-full space-y-4 ">
          <div className="w-full flex items-center gap-2">
            {timeline.map((item) => (
              <Button
                key={item}
                className="bg-purple-400 flex items-center gap-2"
              >
                <MdCalendarMonth /> {item}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
            {stats.map((item) => (
              <Card
                key={item.title}
                className="w-full h-47.5 bg-[#f7f1fb] border-none p-4"
              >
                <h3 className="text-sm font-medium text-gray-500">
                  {item.title}
                </h3>
                <p className="text-3xl font-bold text-gray-900">{item.value}</p>
                <p className="text-sm text-green-500">{item.growth}</p>
              </Card>
            ))}
          </div>
        </div>
        <div className="h-[450px] min-w-0 ">
          <ActiveCampaignChart />
        </div>
      </div>
      <ExistingCampaignTable />
    </div>
  );
}

export default AnalyticsLayout;
