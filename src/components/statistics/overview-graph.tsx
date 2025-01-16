import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { planChartConfig, planChartData } from "@/lib/graph-specs";

const DataLine = () => {
  return (
    <ChartContainer
      config={planChartConfig}
      className="max-h-[calc(100vh-236px)] w-full rounded-lg border p-2.5"
    >
      <LineChart
        accessibilityLayer
        data={planChartData}
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
          dataKey="mealPlan"
          type="monotone"
          stroke="var(--color-mealPlan)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="inventory"
          type="monotone"
          stroke="var(--color-inventory)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="shoppingCart"
          type="monotone"
          stroke="var(--color-shoppingCart)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="chefAI"
          type="monotone"
          stroke="var(--color-chefAI)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="social"
          type="monotone"
          stroke="var(--color-social)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="tokenPurchase"
          type="monotone"
          stroke="var(--color-tokenPurchase)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
};

export default DataLine;
