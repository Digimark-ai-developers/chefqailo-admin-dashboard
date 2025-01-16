import { Info, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { mealUsageChartConfig, mealUsageChartData } from "@/lib/graph-specs";

const NonVaryingUsageGraph = ({ featureName }: { featureName: string }) => {
  return (
    <Card className="relative flex w-full flex-col items-start justify-between">
      <Tooltip>
        <TooltipTrigger asChild className="absolute right-5 top-5">
          <Button variant="outline" size="icon">
            <Info />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-center">
            This Graph consistently Visualizes
            <br />
            the data collected in the past 6 months.
          </p>
        </TooltipContent>
      </Tooltip>
      <CardHeader>
        <CardTitle>
          <span>{featureName} - Feature Usage Graph</span>
        </CardTitle>
        <CardDescription>August 2023 - January 2024</CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <ChartContainer config={mealUsageChartConfig}>
          <BarChart accessibilityLayer data={mealUsageChartData}>
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
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
};

export default NonVaryingUsageGraph;
