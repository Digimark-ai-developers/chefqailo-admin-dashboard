import { useEffect, useState } from "react";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { ChevronDown, Loader2 } from "lucide-react";

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
  useGetFeatureUsageGraphQuery,
  useGetOverallStatsQuery,
  useGetPeakUsageGraphQuery,
} from "@/store/services/statistics";

const featureEnum = {
  overview: "Overview",
  meal: "MealPlan",
  extraTokens: "ExtraTokens",
  chefAI: "ChefAI",
  cart: "Shopping",
  inventory: "Inventory",
  social: "Culinary",
};

const featureChangeEnum = {
  overview: false,
  meal: true,
  extraTokens: true,
  chefAI: true,
  cart: false,
  inventory: false,
  social: true,
};

const Statistics = () => {
  const { getIdToken } = useKindeAuth();
  const [accessToken, setAccessToken] = useState<string>("");
  const [feature, setFeature] = useState<keyof typeof featureEnum>("overview");
  const [activeTab, setActiveTab] = useState<string>("weekly");
  const { data, isLoading } = useGetOverallStatsQuery(
    {
      time: activeTab,
      token: `${accessToken}`,
    },
    {
      skip: !activeTab,
      refetchOnMountOrArgChange: true,
    }
  );
  const { data: featureData } = useGetFeatureUsageGraphQuery(
    {
      params: featureChangeEnum[feature]
        ? `?feature=${featureEnum[feature]}&period=${activeTab}`
        : `?feature=${featureEnum[feature]}`,
      token: `${accessToken}`,
    },
    {
      skip: !feature || feature === "overview",
      refetchOnMountOrArgChange: true,
    }
  );
  const { data: peakData } = useGetPeakUsageGraphQuery(
    {
      feature: featureEnum[feature],
      token: `${accessToken}`,
    },
    {
      skip: !feature || feature === "overview",
      refetchOnMountOrArgChange: true,
    }
  );

  const handleToken = async () => {
    let token: string | undefined = "";

    if (getIdToken) {
      token = await getIdToken();
    }

    if (token) {
      setAccessToken(token);
    }
  };

  useEffect(() => {
    handleToken();
  }, [getIdToken]);

  return (
    <div className="flex h-full w-full flex-col items-start justify-start gap-5">
      <div className="flex w-full items-center justify-center border-b pb-5">
        <span className="flex-1 text-left text-3xl font-bold">Statistics</span>
        <div className="flex items-center justify-center gap-2.5">
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
              <DropdownMenuRadioGroup
                value={feature}
                // @ts-ignore
                onValueChange={setFeature}
              >
                {features.map((feature) => (
                  <DropdownMenuRadioItem key={feature.id} value={feature.value}>
                    {feature.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="weekly">Week</TabsTrigger>
              <TabsTrigger value="monthly">Month</TabsTrigger>
              <TabsTrigger value="yearly">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      {feature === "overview" ? (
        isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="size-10 animate-spin text-primary" />
          </div>
        ) : (
          <OverviewGraph data={data!} />
        )
      ) : null}
      {feature === "meal" && (
        <div className="grid h-full w-full grid-cols-2 gap-5">
          <VaryingUsageGraph
            data={featureData!}
            featureName={features.find((f) => f.value === feature)!.name}
          />
          <PeakGraph
            data={peakData!}
            featureName={features.find((f) => f.value === feature)!.name}
          />
        </div>
      )}
      {feature === "inventory" && (
        <div className="grid h-full w-full grid-cols-2 gap-5">
          <NonVaryingUsageGraph
            data={featureData!}
            featureName={features.find((f) => f.value === feature)!.name}
          />
          <PeakGraph
            data={peakData!}
            featureName={features.find((f) => f.value === feature)!.name}
          />
        </div>
      )}
      {feature === "cart" && (
        <div className="grid h-full w-full grid-cols-2 gap-5">
          <NonVaryingUsageGraph
            data={featureData!}
            featureName={features.find((f) => f.value === feature)!.name}
          />
          <PeakGraph
            data={peakData!}
            featureName={features.find((f) => f.value === feature)!.name}
          />
        </div>
      )}
      {feature === "chefAI" && (
        <div className="grid h-full w-full grid-cols-2 gap-5">
          <VaryingUsageGraph
            data={featureData!}
            featureName={features.find((f) => f.value === feature)!.name}
          />
          <PeakGraph
            data={peakData!}
            featureName={features.find((f) => f.value === feature)!.name}
          />
        </div>
      )}
      {feature === "social" && (
        <div className="grid h-full w-full grid-cols-2 gap-5">
          <VaryingUsageGraph
            data={featureData!}
            featureName={features.find((f) => f.value === feature)!.name}
          />
          <PeakGraph
            data={peakData!}
            featureName={features.find((f) => f.value === feature)!.name}
          />
        </div>
      )}
      {feature === "extraTokens" && (
        <div className="grid h-full w-full grid-cols-2 gap-5">
          <VaryingUsageGraph
            data={featureData!}
            featureName={features.find((f) => f.value === feature)!.name}
          />
          <PeakGraph
            data={peakData!}
            featureName={features.find((f) => f.value === feature)!.name}
          />
        </div>
      )}
    </div>
  );
};

export default Statistics;
