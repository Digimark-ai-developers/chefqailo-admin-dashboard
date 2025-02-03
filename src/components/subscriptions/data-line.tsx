import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { subscriptionChartConfig } from "@/lib/graph-specs";

const DataLine = ({ data }: { data: SubscriptionStats[] }) => {
  return (
    <ChartContainer
      config={subscriptionChartConfig}
      className="max-h-[calc(100vh-320px)] w-full rounded-lg border p-2.5"
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
        />
        <YAxis interval={0} width={10} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Line
          dataKey="free"
          type="monotone"
          stroke="var(--color-free)"
          strokeWidth={2}
          dot={false}
        >
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
          />
        </Line>
        <Line
          dataKey="basic"
          type="monotone"
          stroke="var(--color-basic)"
          strokeWidth={2}
          dot={false}
        >
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
          />
        </Line>
        <Line
          dataKey="standard"
          type="monotone"
          stroke="var(--color-standard)"
          strokeWidth={2}
          dot={false}
        >
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
          />
        </Line>
        <Line
          dataKey="premium"
          type="monotone"
          stroke="var(--color-premium)"
          strokeWidth={2}
          dot={false}
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
  );
};

export default DataLine;
