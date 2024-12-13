import { Bar, BarChart, CartesianGrid, Legend, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { barChartConfig, barChartData } from "@/lib/dashboard-graph-specs";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const DataBar = () => {
  return (
    <Card className="flex h-full w-full flex-col items-center justify-between p-5">
      <CardHeader className="w-full p-0">
        <CardTitle>Paid vs Unpaid Users</CardTitle>
      </CardHeader>
      <CardContent className="w-full p-0">
        <ChartContainer config={barChartConfig}>
          <BarChart accessibilityLayer data={barChartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="paid" fill="var(--color-paid)" radius={4} />
            <Bar dataKey="unpaid" fill="var(--color-unpaid)" radius={4} />
            <Legend />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DataBar;
