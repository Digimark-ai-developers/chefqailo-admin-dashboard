import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { tokenHistoryConfig, tokenHistoryData } from "@/lib/graph-specs";

const TokenHistory = () => {
  return (
    <Card className="flex h-full w-full flex-col items-center justify-between p-2.5">
      <CardHeader className="flex w-full flex-row items-start justify-between gap-0 space-x-0 space-y-0 p-0">
        <CardTitle>Token Usage History</CardTitle>
      </CardHeader>
      <CardContent className="w-full p-0">
        <ChartContainer config={tokenHistoryConfig}>
          <LineChart
            accessibilityLayer
            data={tokenHistoryData}
            margin={{
              top: 20,
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
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="amount"
              type="natural"
              stroke="var(--color-amount)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-amount)",
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
      </CardContent>
    </Card>
  );
};

export default TokenHistory;
