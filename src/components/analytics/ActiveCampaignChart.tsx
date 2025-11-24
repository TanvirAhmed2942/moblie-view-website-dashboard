"use client";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { BsBarChartFill } from "react-icons/bs";

interface ChartData {
  month: string;
  users: number;
}

function ActiveCampaignChart() {
  const totalUsersByMonth: ChartData[] = [
    { month: "Jan", users: 120 },
    { month: "Feb", users: 80 },
    { month: "Mar", users: 150 },
    { month: "Apr", users: 100 },
    { month: "May", users: 200 },
    { month: "Jun", users: 170 },
    { month: "Jul", users: 220 },
    { month: "Aug", users: 190 },
    { month: "Sep", users: 140 },
    { month: "Oct", users: 180 },
    { month: "Nov", users: 210 },
    { month: "Dec", users: 250 },
  ];

  return (
    <Card className="p-0 h-full">
      <div className="flex items-center gap-2 px-6 mt-5 relative">
        <BsBarChartFill size={20} className="text-green-500" />
        <h1 className="text-xl font-semibold">Donation Growth</h1>
      </div>

      <div className="w-full h-full py-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={totalUsersByMonth}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              strokeWidth={0.2}
              vertical={false}
            />
            <XAxis dataKey="month" style={{ fontSize: "14px" }} />
            <YAxis style={{ fontSize: "14px" }} />
            <Tooltip
              content={<CustomTooltip />}
              isAnimationActive={true}
              cursor={false}
            />
            <Bar
              dataKey="users"
              fill="#d6c4fd"
              barSize={15}
              radius={[10, 10, 0, 0]}
              activeBar={{ fill: "#8948c7" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default ActiveCampaignChart;

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    fill: string;
    payload: {
      month: string;
      users: number;
    };
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="relative flex flex-col gap-1 p-2 bg-white border border-gray-200 rounded shadow-md text-sm">
        <div className="font-semibold text-gray-700 mb-1">Month: {label}</div>
        {payload.map((pld, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: pld.fill }}
            ></span>
            <span className="text-gray-800">
              Total Donations: {pld.value} k
            </span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};
