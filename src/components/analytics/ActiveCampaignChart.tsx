"use client";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DonationData {
  month: string;
  amount: number;
}

interface PeakMonth {
  month: string;
  amount: number;
}

interface ActiveCampaignChartProps {
  donationData: DonationData[];
  year: number;
  peakMonth?: PeakMonth;
  onYearChange: (year: number) => void;
}

function ActiveCampaignChart({
  donationData,
  year,
  peakMonth,
  onYearChange
}: ActiveCampaignChartProps) {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Transform data for chart (convert to thousands for display)
  const chartData = donationData.map(item => ({
    month: item.month,
    amount: item.amount / 1000, // Convert to thousands for k display
  }));

  return (
    <Card className="p-6 h-full bg-white border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Donation Growth</h2>
        <Select
          value={year.toString()}
          onValueChange={(value) => onYearChange(parseInt(value))}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder={year} />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((yr) => (
              <SelectItem key={yr} value={yr.toString()}>
                {yr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              strokeWidth={0.5}
              stroke="#e5e7eb"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              style={{ fontSize: "12px" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              style={{ fontSize: "12px" }}
              tickFormatter={(value) => `${value}k`}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<CustomTooltip peakMonth={peakMonth} />}
              cursor={{ fill: 'transparent' }}
            />
            <Bar
              dataKey="amount"
              fill="#c4b5fd"
              barSize={20}
              radius={[8, 8, 0, 0]}
              activeBar={{ fill: "#7c3aed" }}
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
      amount: number;
    };
  }>;
  label?: string;
  peakMonth?: PeakMonth;
}

const CustomTooltip = ({ active, payload, label, peakMonth }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const currentAmount = payload[0].payload.amount;
    const originalAmount = currentAmount * 1000;
    const displayAmount = `$${originalAmount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

    const isPeakMonth = peakMonth?.month === label;

    return (
      <div className="relative">
        {isPeakMonth && (
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-black"></div>
        )}
        <div className="bg-black text-white px-3 py-2 rounded shadow-lg text-sm font-semibold">
          {displayAmount}
        </div>
      </div>
    );
  }

  return null;
};