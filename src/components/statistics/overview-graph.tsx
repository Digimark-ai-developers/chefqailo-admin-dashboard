import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { planChartConfig, planChartData } from "@/lib/graph-specs";

const DataLine = () => {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-5">
      <div className="flex w-full items-center justify-center">
        <span className="w-full text-left font-semibold leading-none tracking-tight">
          Overview - Feature Trend
        </span>
        <span className="w-full text-right text-sm text-muted-foreground">
          August 2023 - January 2024
        </span>
      </div>
      <ChartContainer
        config={planChartConfig}
        className="max-h-[calc(100vh-282px)] w-full rounded-lg border p-2.5"
      >
        <LineChart
          accessibilityLayer
          data={planChartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid
            vertical={true}
            horizontal={true}
            className="!stroke-gray-300 dark:!stroke-gray-800"
            strokeDasharray="5 5"
            shapeRendering="crispEdges"
          />
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
            type="natural"
            stroke="var(--color-mealPlan)"
            strokeWidth={2}
            dot={{
              fill: "var(--color-mealPlan)",
            }}
            activeDot={{
              r: 6,
            }}
          >
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
            />
          </Line>
          <Line
            dataKey="inventory"
            type="natural"
            stroke="var(--color-inventory)"
            strokeWidth={2}
            dot={{
              fill: "var(--color-inventory)",
            }}
            activeDot={{
              r: 6,
            }}
          >
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
            />
          </Line>
          <Line
            dataKey="shoppingCart"
            type="natural"
            stroke="var(--color-shoppingCart)"
            strokeWidth={2}
            dot={{
              fill: "var(--color-shoppingCart)",
            }}
            activeDot={{
              r: 6,
            }}
          >
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
            />
          </Line>
          <Line
            dataKey="chefAI"
            type="natural"
            stroke="var(--color-chefAI)"
            strokeWidth={2}
            dot={{
              fill: "var(--color-chefAI)",
            }}
            activeDot={{
              r: 6,
            }}
          >
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
            />
          </Line>
          <Line
            dataKey="social"
            type="natural"
            stroke="var(--color-social)"
            strokeWidth={2}
            dot={{
              fill: "var(--color-social)",
            }}
            activeDot={{
              r: 6,
            }}
          >
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
            />
          </Line>
          <Line
            dataKey="extraTokens"
            type="natural"
            stroke="var(--color-extraTokens)"
            strokeWidth={2}
            dot={{
              fill: "var(--color-extraTokens)",
            }}
            activeDot={{
              r: 6,
            }}
          >
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
            />
          </Line>
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default DataLine;
