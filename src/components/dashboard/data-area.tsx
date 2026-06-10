import { Loader2 } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Legend, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { subscriptionChartConfig } from "@/lib/graph-specs";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type PaidGraphChart2Item = {
  month: string;
  free: number;
  standard: number;
  premium: number;
};

const DataArea = ({
  data = [],
  isLoading = false,
}: {
  data?: PaidGraphChart2Item[];
  isLoading?: boolean;
}) => {
  return (
    <Card className="flex h-full w-full flex-col items-center justify-between p-5">
      <CardHeader className="w-full p-0">
        <CardTitle>Free, Standard, Premium Users</CardTitle>
      </CardHeader>
      <CardContent className="w-full p-0">
        {isLoading ? (
          <div className="flex aspect-video w-full items-center justify-center">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : (
          <ChartContainer config={subscriptionChartConfig}>
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="free"
                type="natural"
                fill="var(--color-free)"
                fillOpacity={0.4}
                stroke="var(--color-free)"
                stackId="a"
              />
              <Area
                dataKey="standard"
                type="natural"
                fill="var(--color-standard)"
                fillOpacity={0.4}
                stroke="var(--color-standard)"
                stackId="a"
              />
              <Area
                dataKey="premium"
                type="natural"
                fill="var(--color-premium)"
                fillOpacity={0.4}
                stroke="var(--color-premium)"
                stackId="a"
              />
              <Legend />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default DataArea;
