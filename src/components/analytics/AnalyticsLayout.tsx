"use client";
import { useState } from "react";
import { FaBullhorn, FaDollarSign, FaUserPlus, FaUsers } from "react-icons/fa";
import { useOverviewDataQuery } from "../../features/overview/overviewApi";
import { Card } from "../ui/card";
import ActiveCampaignChart from "./ActiveCampaignChart";
import ExistingCampaignTable from './ExistingCampaignTable';

function AnalyticsLayout() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { data, isLoading } = useOverviewDataQuery(selectedYear);
  console.log("overview data", data);

  const apiData = data?.data;
  console.log("Overview API Data:", apiData);

  const stats = [
    {
      icon: <FaDollarSign className="text-white" size={24} />,
      title: "Total Funds Raised",
      value: `$${apiData?.totalFundRaise?.toLocaleString() || '0'}`,
      bgColor: "bg-purple-500",
    },
    {
      icon: <FaUsers className="text-white" size={24} />,
      title: "Total Donors",
      value: apiData?.totalDonar?.toLocaleString() || '0',
      bgColor: "bg-purple-500",
    },
    {
      icon: <FaBullhorn className="text-white" size={24} />,
      title: "Active Campaigns",
      value: apiData?.activeCamping?.toString() || '0',
      bgColor: "bg-purple-500",
    },
    {
      icon: <FaUserPlus className="text-white" size={24} />,
      title: "Total Invitees",
      value: apiData?.invited?.toLocaleString() || '0',
      bgColor: "bg-purple-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">
          Welcome back, Admin! Here&aposs a summary of your foundation activity
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side - Stats cards */}
        <div className="lg:col-span-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2  gap-4">
          {stats.map((item, index) => (
            <Card
              key={index}
              className="bg-purple-50 border-none p-3 flex flex-col items-center justify-center text-center "
            >
              <div className={`${item.bgColor} w-16 h-16 rounded-full flex items-center justify-center`}>
                {item.icon}
              </div>
              <h3 className="text-sm font-medium text-gray-600">
                {item.title}
              </h3>
              <p className="text-3xl font-bold text-gray-900">{item.value}</p>
            </Card>
          ))}
        </div>

        {/* Right side - Chart */}
        <div className="lg:col-span-2 ">
          <ActiveCampaignChart
            donationData={apiData?.donationGrowth?.data || []}
            year={selectedYear}
            peakMonth={apiData?.donationGrowth?.peakMonth}
            onYearChange={setSelectedYear}
          />
        </div>
      </div>
      <ExistingCampaignTable />
    </div>
  );
}

export default AnalyticsLayout;