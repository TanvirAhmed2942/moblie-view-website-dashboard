"use client";
import { Card } from "@/components/ui/card";
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

function AreaChart() {
  const [open, setOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  // Mock data for the chart
  const chartData = [
    {
      month: "Jan",
      users: 1200,
      activeUsers: 800,
      questionsAnswered: 450,
      lessonsCompleted: 320,
    },
    {
      month: "Feb",
      users: 1350,
      activeUsers: 920,
      questionsAnswered: 520,
      lessonsCompleted: 380,
    },
    {
      month: "Mar",
      users: 1500,
      activeUsers: 1100,
      questionsAnswered: 680,
      lessonsCompleted: 450,
    },
    {
      month: "Apr",
      users: 1650,
      activeUsers: 1250,
      questionsAnswered: 750,
      lessonsCompleted: 520,
    },
    {
      month: "May",
      users: 1800,
      activeUsers: 1400,
      questionsAnswered: 820,
      lessonsCompleted: 580,
    },
    {
      month: "Jun",
      users: 1950,
      activeUsers: 1550,
      questionsAnswered: 900,
      lessonsCompleted: 650,
    },
    {
      month: "Jul",
      users: 2100,
      activeUsers: 1700,
      questionsAnswered: 980,
      lessonsCompleted: 720,
    },
    {
      month: "Aug",
      users: 2250,
      activeUsers: 1850,
      questionsAnswered: 1050,
      lessonsCompleted: 780,
    },
    {
      month: "Sep",
      users: 2400,
      activeUsers: 2000,
      questionsAnswered: 1120,
      lessonsCompleted: 850,
    },
    {
      month: "Oct",
      users: 2550,
      activeUsers: 2150,
      questionsAnswered: 1200,
      lessonsCompleted: 920,
    },
    {
      month: "Nov",
      users: 2700,
      activeUsers: 2300,
      questionsAnswered: 1280,
      lessonsCompleted: 980,
    },
    {
      month: "Dec",
      users: 2850,
      activeUsers: 2450,
      questionsAnswered: 1350,
      lessonsCompleted: 1050,
    },
  ];

  return (
    <Card className="p-0 h-full overflow-x-clip">
      <div className="flex items-center justify-between px-6 mt-5 relative">
        <h1 className="text-2xl font-semibold">User Engagements</h1>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="year"
              className="w-32 justify-between font-normal"
            >
              {selectedYear}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" align="start">
            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() - 5 + i;
                return (
                  <Button
                    key={year}
                    variant={selectedYear === year ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setSelectedYear(year);
                      setOpen(false);
                    }}
                    className="w-full"
                  >
                    {year}
                  </Button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="w-full h-full py-1">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart
            data={chartData}
            margin={{ top: 20, right: 2, left: 0, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00705d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#00705d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              strokeWidth={0.6}
              vertical={true}
              stroke="gray"
              fillOpacity={0.2}
            />
            <XAxis dataKey="month" style={{ fontSize: "14px" }} />
            <YAxis style={{ fontSize: "14px" }} />
            <Tooltip
              content={<CustomTooltip active={true} payload={[]} label={""} />}
              isAnimationActive={true}
              cursor={false}
            />
            <Area
              type="monotone"
              dataKey="users"
              stroke="#00705d"
              fill="url(#colorUv)"
              fillOpacity={0.3}
              strokeWidth={0.5}
              isAnimationActive={true}
            />
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default AreaChart;

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active: boolean;
  payload: Array<{
    value: number;
    payload: {
      month: string;
      users: number;
      activeUsers: number;
      questionsAnswered: number;
      lessonsCompleted: number;
    };
  }>;
  label: string;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="relative flex flex-col gap-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg text-sm min-w-[200px]">
        <div className="font-semibold text-gray-800 mb-2 text-center">
          Month: {label}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: "#8884d8" }}
              ></span>
              <span className="text-gray-700">Total Users:</span>
            </div>
            <span className="font-medium text-gray-900">{data.users}</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: "#10b981" }}
              ></span>
              <span className="text-gray-700">Active Users:</span>
            </div>
            <span className="font-medium text-gray-900">
              {data.activeUsers}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: "#f59e0b" }}
              ></span>
              <span className="text-gray-700">Questions:</span>
            </div>
            <span className="font-medium text-gray-900">
              {data.questionsAnswered}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: "#8b5cf6" }}
              ></span>
              <span className="text-gray-700">Lessons:</span>
            </div>
            <span className="font-medium text-gray-900">
              {data.lessonsCompleted}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
