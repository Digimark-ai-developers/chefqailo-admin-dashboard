import { useState } from "react";

import dayjs from "dayjs";
import { ChevronDown, CircleArrowLeft, CircleArrowRight } from "lucide-react";

import NonVaryingUsageGraph from "@/components/statistics/non-varying-usage-graph";
import OverviewGraph from "@/components/statistics/overview-graph";
import PeakGraph from "@/components/statistics/peak-graph";
import VaryingUsageGraph from "@/components/statistics/varying-usage-graph";
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
      {feature === "overview" && <OverviewGraph />}
      {feature === "meal" && (
        <div className="grid h-full w-full grid-cols-2 gap-5">
          <VaryingUsageGraph
            featureName={features.find((f) => f.value === feature)!.name}
          />
          <PeakGraph
            featureName={features.find((f) => f.value === feature)!.name}
          />
        </div>
      )}
      {feature === "inventory" && (
        <div className="grid h-full w-full grid-cols-2 gap-5">
          <NonVaryingUsageGraph
            featureName={features.find((f) => f.value === feature)!.name}
          />
          <PeakGraph
            featureName={features.find((f) => f.value === feature)!.name}
          />
        </div>
      )}
      {feature === "cart" && (
        <div className="grid h-full w-full grid-cols-2 gap-5">
          <NonVaryingUsageGraph
            featureName={features.find((f) => f.value === feature)!.name}
          />
          <PeakGraph
            featureName={features.find((f) => f.value === feature)!.name}
          />
        </div>
      )}
      {feature === "chefAI" && (
        <div className="grid h-full w-full grid-cols-2 gap-5">
          <VaryingUsageGraph
            featureName={features.find((f) => f.value === feature)!.name}
          />
          <PeakGraph
            featureName={features.find((f) => f.value === feature)!.name}
          />
        </div>
      )}
      {feature === "social" && (
        <div className="grid h-full w-full grid-cols-2 gap-5">
          <VaryingUsageGraph
            featureName={features.find((f) => f.value === feature)!.name}
          />
          <PeakGraph
            featureName={features.find((f) => f.value === feature)!.name}
          />
        </div>
      )}
      {feature === "extraTokens" && (
        <div className="grid h-full w-full grid-cols-2 gap-5">
          <VaryingUsageGraph
            featureName={features.find((f) => f.value === feature)!.name}
          />
          <PeakGraph
            featureName={features.find((f) => f.value === feature)!.name}
          />
        </div>
      )}
    </div>
  );
};

export default Statistics;
