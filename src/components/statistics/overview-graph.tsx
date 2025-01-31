import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { planChartConfig } from "@/lib/graph-specs";

const OverviewGraph = ({ data }: { data: OverallStats[] }) => {
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
        className="max-h-[calc(100vh-221px)] w-full rounded-lg border p-2.5"
      >
        <LineChart
          accessibilityLayer
          data={data}
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
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Line
            dataKey="meal_plan_count"
            type="natural"
            stroke="var(--color-meal_plan_count)"
            strokeWidth={2}
            dot={{
              fill: "var(--color-meal_plan_count)",
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
            dataKey="inventory_count"
            type="natural"
            stroke="var(--color-inventory_count)"
            strokeWidth={2}
            dot={{
              fill: "var(--color-inventory_count)",
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
            dataKey="shopping_count"
            type="natural"
            stroke="var(--color-shopping_count)"
            strokeWidth={2}
            dot={{
              fill: "var(--color-shopping_count)",
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
            dataKey="chat_history_count"
            type="natural"
            stroke="var(--color-chat_history_count)"
            strokeWidth={2}
            dot={{
              fill: "var(--color-chat_history_count)",
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
            dataKey="culinary_recipe_count"
            type="natural"
            stroke="var(--color-culinary_recipe_count)"
            strokeWidth={2}
            dot={{
              fill: "var(--color-culinary_recipe_count)",
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
            dataKey="token_tracking_count"
            type="natural"
            stroke="var(--color-token_tracking_count)"
            strokeWidth={2}
            dot={{
              fill: "var(--color-token_tracking_count)",
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

export default OverviewGraph;
