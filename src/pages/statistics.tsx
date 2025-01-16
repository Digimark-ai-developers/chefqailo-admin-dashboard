import { useState } from "react";

import dayjs from "dayjs";
import { ChevronDown, CircleArrowLeft, CircleArrowRight } from "lucide-react";

import PeakGraph from "@/components/statistics/meal/peak-graph";
import UsageGraph from "@/components/statistics/meal/usage-graph";
import DataLine from "@/components/statistics/overview-graph";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { features } from "@/lib/constants";
import {
  type ActiveTab,
  type DateRange,
  getUpdatedDateRange,
} from "@/lib/utils";

const Statistics = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: dayjs().startOf("week"),
    endDate: dayjs().endOf("week"),
  });
  const [activeTab, setActiveTab] = useState<string>("week");
  const [feature, setFeature] = useState<string>("overview");

  const handleNavigation = (direction: "previous" | "next") => {
    const updatedRange = getUpdatedDateRange(
      activeTab as ActiveTab,
      dateRange,
      direction
    );
    setDateRange(updatedRange);
  };

  return (
    <div className="flex h-full w-full flex-col items-start justify-start gap-5">
      <div className="flex w-full items-center justify-center border-b pb-5">
        <span className="flex-1 text-left text-3xl font-bold">Statistics</span>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex w-full items-center justify-start gap-2.5">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleNavigation("previous")}
          >
            <CircleArrowLeft className="text-primary" />
          </Button>
          <span>
            {dateRange.startDate.format("DD MMM, YYYY")} -&nbsp;
            {dateRange.endDate.format("DD MMM, YYYY")}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleNavigation("next")}
          >
            <CircleArrowRight className="text-primary" />
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {features.find((f) => f.value === feature)?.name}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select Feature</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={feature} onValueChange={setFeature}>
              {features.map((feature) => (
                <DropdownMenuRadioItem key={feature.id} value={feature.value}>
                  {feature.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {feature === "overview" ? (
        <DataLine />
      ) : (
        <div className="grid h-full w-full grid-cols-2 gap-5">
          <UsageGraph />
          <PeakGraph />
        </div>
      )}
    </div>
  );
};

export default Statistics;
