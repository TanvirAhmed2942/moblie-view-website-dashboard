import { Card, CardContent } from "@/components/ui/card";
import { StatProps } from "./analytics.type";

export function Stats({ stats }: { stats: StatProps[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card className="w-full" key={index}>
          <CardContent className="p-6">
            <div className="text-left">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
