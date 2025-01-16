import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { paymentHistoryConfig, paymentHistoryData } from "@/lib/graph-specs";

const PaymentHistory = () => {
  return (
    <Card className="flex h-full w-full flex-col items-center justify-between p-5">
      <CardHeader className="w-full p-0">
        <CardTitle>Payment History</CardTitle>
      </CardHeader>
      <CardContent className="w-full p-0">
        <ChartContainer config={paymentHistoryConfig}>
          <LineChart
            accessibilityLayer
            data={paymentHistoryData}
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

export default PaymentHistory;
