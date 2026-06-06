import { useEffect, useState } from "react";

import { CircleDollarSign, Loader2, User2, Users } from "lucide-react";

import DataArea from "@/components/dashboard/data-area";
import DataBar from "@/components/dashboard/data-bar";
import DataLine from "@/components/dashboard/data-line";
import StatCard from "@/components/dashboard/stat-card";
import UserTable from "@/components/dashboard/user-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { lineChartConfig } from "@/lib/graph-specs";
import { getAdminAccessToken } from "@/lib/admin-auth";
import { cn } from "@/lib/utils";
import {
  useGetStatsGraphQuery,
  useGetUserStatsQuery,
} from "@/store/services/user";

const Dashboard = () => {
  const { open } = useSidebar();
  const [activeChart, setActiveChart] =
    useState<keyof typeof lineChartConfig>("inactive");
  const [selectedStat, setSelectedStat] = useState<
    "users" | "monthly_sales_amount" | "total_sales"
  >("users");
  const [position, setPosition] = useState<string>("weekly");
  const [accessToken, setAccessToken] = useState<string>("");
  const { data, isLoading } = useGetStatsGraphQuery(
    { time: position, token: `${accessToken}` },
    {
      skip: !accessToken || accessToken === "",
      refetchOnMountOrArgChange: true,
    }
  );
  const { data: stats, isLoading: statsLoading } = useGetUserStatsQuery(
    `${accessToken}`,
    {
      skip: !accessToken || accessToken === "",
      refetchOnMountOrArgChange: true,
    }
  );

  const handleToken = async () => {
    const token = getAdminAccessToken();

    if (token) {
      setAccessToken(token);
    }
  };

  const statsDataFormatter = () => {
    const icons = [User2, CircleDollarSign, Users];

    if (stats) {
      return stats.map((stat, idx) => {
        return {
          ...stat,
          id: idx + 1,
          chart:
            idx === 0
              ? "inactive"
              : idx === 1
                ? "active"
                : ("tablet" as keyof typeof lineChartConfig),
          tag: (stat.name === "Users"
            ? "users"
            : stat.name === "Monthly Sales"
              ? "monthly_sales_amount"
              : "total_sales") as
            | "users"
            | "monthly_sales_amount"
            | "total_sales",
          icon: icons[idx],
          increase: stat.increase ? true : false,
        };
      });
    }
  };

  const clickEvent = (
    chart: "views" | "inactive" | "active" | "tablet",
    stat: "users" | "monthly_sales_amount" | "total_sales"
  ) => {
    setSelectedStat(stat);
    setActiveChart(chart);
  };

  useEffect(() => {
    handleToken();
  }, []);

  return (
    <div className="flex h-full w-full flex-col gap-2.5 overflow-y-auto lg:grid lg:grid-rows-3 lg:overflow-hidden">
      <div className="row-span-2 grid w-full grid-cols-2 items-start justify-start gap-2.5 lg:grid-cols-8">
        <div className="col-span-2 flex h-full w-full flex-col items-start justify-start gap-2.5 rounded-xl border p-2.5 lg:col-span-5 xl:col-span-6">
          <div className="flex w-full items-center justify-center">
            <span className="flex-1 text-left text-xl font-semibold">
              Overview
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="capitalize">
                  {position}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-auto">
                <DropdownMenuRadioGroup
                  value={position}
                  onValueChange={setPosition}
                >
                  <DropdownMenuRadioItem value="weekly">
                    Weekly
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="monthly">
                    Monthly
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="yearly">
                    Yearly
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div
            className={cn(
              "grid h-fit min-h-[142px] w-full grid-cols-1 rounded-lg bg-muted p-2.5 md:grid-cols-3",
              {
                "gap-0 xl:gap-2.5": open,
                "gap-2.5": !open,
              }
            )}
          >
            {statsLoading ? (
              <div className="col-span-1 flex w-full items-center justify-center md:col-span-3">
                <Loader2 className="size-10 animate-spin text-primary" />
              </div>
            ) : (
              statsDataFormatter()?.map((card, idx) => (
                <StatCard
                  card={card}
                  key={idx}
                  selectedStat={selectedStat}
                  clickEvent={() =>
                    clickEvent(
                      card.chart,
                      card.tag as
                        | "users"
                        | "monthly_sales_amount"
                        | "total_sales"
                    )
                  }
                />
              ))
            )}
          </div>
          <div className="h-full w-full">
            {isLoading ? (
              <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="size-10 animate-spin text-primary" />
              </div>
            ) : (
              <DataLine activeChart={activeChart} data={data!} />
            )}
          </div>
        </div>
        <div className="col-span-2 flex h-full w-full flex-col items-start justify-start gap-2.5 rounded-xl md:flex-row lg:col-span-3 lg:flex-col xl:col-span-2">
          <DataBar />
          <DataArea />
        </div>
      </div>
      <div className="row-span-1 h-full w-full">
        <UserTable />
      </div>
    </div>
  );
};

export default Dashboard;
