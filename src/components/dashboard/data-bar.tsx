import { Loader2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { barChartConfig, barChartData } from "@/lib/graph-specs";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type PaidGraphChart1Item = {
  month: string;
  unpaid: number;
  paid: number;
};

const DataBar = ({
  data = barChartData,
  isLoading = false,
}: {
  data?: PaidGraphChart1Item[];
  isLoading?: boolean;
}) => {
  return (
    <Card className="flex h-full w-full flex-col items-center justify-between p-5">
      <CardHeader className="w-full p-0">
        <CardTitle>Paid vs Unpaid Users</CardTitle>
      </CardHeader>
      <CardContent className="w-full p-0">
        {isLoading ? (
          <div className="flex aspect-video w-full items-center justify-center">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : (
          <ChartContainer config={barChartConfig}>
            <BarChart accessibilityLayer data={data}>
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
        )}
      </CardContent>
    </Card>
  );
};

export default DataBar;
