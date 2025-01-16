import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { lineChartConfig } from "@/lib/graph-specs";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

const DataLine = ({
  data,
  activeChart,
}: {
  data: { date: string; inactive: number; active: number; tablet: number }[];
  activeChart: keyof typeof lineChartConfig;
}) => {
  return (
    <ChartContainer
      config={lineChartConfig}
      className="aspect-auto h-[250px] w-full lg:h-full"
    >
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="w-[150px]"
              nameKey="views"
              labelFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
              }}
            />
          }
        />
        <Line
          dataKey={activeChart}
          type="monotone"
          stroke={`var(--color-${activeChart})`}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
};

export default DataLine;
