import { Area, AreaChart, CartesianGrid, Legend, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { areaChartConfig, areaChartData } from "@/lib/graph-specs";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const DataArea = () => {
  return (
    <Card className="flex h-full w-full flex-col items-center justify-between p-5">
      <CardHeader className="w-full p-0">
        <CardTitle>Active vs Inactive Users</CardTitle>
      </CardHeader>
      <CardContent className="w-full p-0">
        <ChartContainer config={areaChartConfig}>
          <AreaChart
            accessibilityLayer
            data={areaChartData}
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
              dataKey="active"
              type="natural"
              fill="var(--color-active)"
              fillOpacity={0.4}
              stroke="var(--color-active)"
              stackId="a"
            />
            <Area
              dataKey="inactive"
              type="natural"
              fill="var(--color-inactive)"
              fillOpacity={0.4}
              stroke="var(--color-inactive)"
              stackId="a"
            />
            <Legend />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DataArea;
