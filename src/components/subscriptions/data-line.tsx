import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  subscriptionChartConfig,
  subscriptionChartData,
} from "@/lib/graph-specs";

const DataLine = () => {
  return (
    <ChartContainer
      config={subscriptionChartConfig}
      className="max-h-[calc(100vh-320px)] w-full rounded-lg border p-2.5"
    >
      <LineChart
        accessibilityLayer
        data={subscriptionChartData}
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
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Line
          dataKey="free"
          type="monotone"
          stroke="var(--color-free)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="basic"
          type="monotone"
          stroke="var(--color-basic)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="pro"
          type="monotone"
          stroke="var(--color-pro)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="premium"
          type="monotone"
          stroke="var(--color-premium)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
};

export default DataLine;
