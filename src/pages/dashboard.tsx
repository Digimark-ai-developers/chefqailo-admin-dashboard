import { useMemo, useState } from "react";

import {
  Check,
  CircleDollarSign,
  Filter,
  Loader2,
  User2,
  Users,
  X,
} from "lucide-react";

import DataArea from "@/components/dashboard/data-area";
import DataBar from "@/components/dashboard/data-bar";
import DataLine from "@/components/dashboard/data-line";
import StatCard from "@/components/dashboard/stat-card";
import UserTable from "@/components/dashboard/user-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import { useAdminAccessToken } from "@/hooks/use-admin-access-token";
import { lineChartConfig } from "@/lib/graph-specs";
import { cn } from "@/lib/utils";
import {
  useGetPaidGraphQuery,
  useGetStatsGraphQuery,
  useGetUserStatsQuery,
} from "@/store/services/user";

const DEFAULT_DASHBOARD_STATS_START_DATE = "2024-01-01";

type StatsDateFilter = "all" | "weekly" | "monthly" | "yearly" | "custom";

const getTodayInputDate = () => {
  const today = new Date();

  return formatInputDate(today);
};

const formatInputDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getPresetStartDate = (
  period: Exclude<StatsDateFilter, "all" | "custom">
) => {
  const today = new Date();
  const startDate = new Date(today);

  if (period === "weekly") {
    const day = today.getDay();
    const daysSinceMonday = day === 0 ? 6 : day - 1;
    startDate.setDate(today.getDate() - daysSinceMonday);
  }

  if (period === "monthly") {
    startDate.setDate(1);
  }

  if (period === "yearly") {
    startDate.setMonth(0, 1);
  }

  return formatInputDate(startDate);
};

const Dashboard = () => {
  const { open } = useSidebar();
  const [activeChart, setActiveChart] =
    useState<keyof typeof lineChartConfig>("inactive");
  const [selectedStat, setSelectedStat] = useState<
    "users" | "monthly_sales_amount" | "total_sales"
  >("users");
  const accessToken = useAdminAccessToken();
  const [defaultStatsEndDate] = useState<string>(() => getTodayInputDate());
  const [statsFilterOpen, setStatsFilterOpen] = useState<boolean>(false);
  const [statsStartDate, setStatsStartDate] = useState<string>(
    DEFAULT_DASHBOARD_STATS_START_DATE
  );
  const [statsEndDate, setStatsEndDate] = useState<string>(defaultStatsEndDate);
  const [statsDateFilter, setStatsDateFilter] =
    useState<StatsDateFilter>("all");
  const [appliedStatsStartDate, setAppliedStatsStartDate] = useState<string>(
    DEFAULT_DASHBOARD_STATS_START_DATE
  );
  const [appliedStatsEndDate, setAppliedStatsEndDate] =
    useState<string>(defaultStatsEndDate);
  const [appliedStatsDateFilter, setAppliedStatsDateFilter] =
    useState<StatsDateFilter>("all");
  const appliedStatsPeriod =
    appliedStatsDateFilter === "weekly" ||
    appliedStatsDateFilter === "monthly" ||
    appliedStatsDateFilter === "yearly"
      ? appliedStatsDateFilter
      : undefined;
  const isStatsFilterActive = appliedStatsDateFilter !== "all";
  const { data, isLoading } = useGetStatsGraphQuery(
    {
      token: accessToken,
      period: appliedStatsPeriod,
      startDate: appliedStatsPeriod ? undefined : appliedStatsStartDate,
      endDate: appliedStatsPeriod ? undefined : appliedStatsEndDate,
    },
    {
      skip: !accessToken || accessToken === "",
      refetchOnMountOrArgChange: true,
    }
  );
  const { data: stats, isLoading: statsLoading } = useGetUserStatsQuery(
    {
      token: accessToken,
      period: appliedStatsPeriod,
      startDate: appliedStatsPeriod ? undefined : appliedStatsStartDate,
      endDate: appliedStatsPeriod ? undefined : appliedStatsEndDate,
    },
    {
      skip: !accessToken || accessToken === "",
      refetchOnMountOrArgChange: true,
    }
  );
  const { data: paidGraph, isLoading: paidGraphLoading } = useGetPaidGraphQuery(
    {
      token: accessToken,
      period: appliedStatsPeriod,
      startDate: appliedStatsPeriod ? undefined : appliedStatsStartDate,
      endDate: appliedStatsPeriod ? undefined : appliedStatsEndDate,
    },
    {
      skip: !accessToken || accessToken === "",
      refetchOnMountOrArgChange: true,
    }
  );

  const statsData = useMemo(() => {
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
  }, [stats]);

  const clickEvent = (
    chart: "views" | "inactive" | "active" | "tablet",
    stat: "users" | "monthly_sales_amount" | "total_sales"
  ) => {
    setSelectedStat(stat);
    setActiveChart(chart);
  };

  const handleStatsStartDateChange = (value: string) => {
    setStatsStartDate(value);
    setStatsDateFilter("custom");

    if (statsEndDate && value && statsEndDate < value) {
      setStatsEndDate("");
    }
  };

  const handleStatsEndDateChange = (value: string) => {
    setStatsEndDate(value);
    setStatsDateFilter("custom");
  };

  const selectStatsPreset = (
    period: Exclude<StatsDateFilter, "all" | "custom">
  ) => {
    setStatsDateFilter(period);
    setStatsStartDate(getPresetStartDate(period));
    setStatsEndDate(defaultStatsEndDate);
  };

  const applyStatsDateFilters = () => {
    setAppliedStatsStartDate(statsStartDate);
    setAppliedStatsEndDate(statsEndDate);
    setAppliedStatsDateFilter(statsDateFilter);
    setStatsFilterOpen(false);
  };

  const clearStatsDateFilters = () => {
    setStatsStartDate(DEFAULT_DASHBOARD_STATS_START_DATE);
    setStatsEndDate(defaultStatsEndDate);
    setStatsDateFilter("all");
    setAppliedStatsStartDate(DEFAULT_DASHBOARD_STATS_START_DATE);
    setAppliedStatsEndDate(defaultStatsEndDate);
    setAppliedStatsDateFilter("all");
    setStatsFilterOpen(false);
  };

  return (
    <>
      <Dialog open={statsFilterOpen} onOpenChange={setStatsFilterOpen}>
        <DialogContent className="max-w-sm md:max-w-md">
          <DialogHeader>
            <DialogTitle>Filter dashboard stats</DialogTitle>
            <DialogDescription>
              Select a date range for the dashboard user stats.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={statsDateFilter === "weekly" ? "default" : "outline"}
                onClick={() => selectStatsPreset("weekly")}
              >
                Weekly
              </Button>
              <Button
                type="button"
                variant={statsDateFilter === "monthly" ? "default" : "outline"}
                onClick={() => selectStatsPreset("monthly")}
              >
                Monthly
              </Button>
              <Button
                type="button"
                variant={statsDateFilter === "yearly" ? "default" : "outline"}
                onClick={() => selectStatsPreset("yearly")}
              >
                Yearly
              </Button>
            </div>
            <label className="flex flex-col gap-1 text-sm font-medium">
              Start date
              <Input
                type="date"
                value={statsStartDate}
                max={statsEndDate || undefined}
                onChange={(event) =>
                  handleStatsStartDateChange(event.target.value)
                }
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium">
              End date
              <Input
                type="date"
                value={statsEndDate}
                min={statsStartDate || undefined}
                onChange={(event) =>
                  handleStatsEndDateChange(event.target.value)
                }
              />
            </label>
          </div>
          <DialogFooter className="gap-2.5">
            <Button
              variant="outline"
              type="button"
              onClick={clearStatsDateFilters}
              disabled={statsLoading || isLoading || paidGraphLoading}
            >
              <X className="size-4" />
              Remove all filters
            </Button>
            <Button
              type="button"
              onClick={applyStatsDateFilters}
              disabled={
                !statsStartDate ||
                !statsEndDate ||
                statsLoading ||
                isLoading ||
                paidGraphLoading
              }
            >
              <Check className="size-4" />
              Apply filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex h-full w-full flex-col gap-2.5 overflow-y-auto lg:grid lg:grid-rows-3 lg:overflow-hidden">
        <div className="row-span-2 grid w-full grid-cols-2 items-start justify-start gap-2.5 lg:grid-cols-8">
          <div className="col-span-2 flex h-full w-full flex-col items-start justify-start gap-2.5 rounded-xl border p-2.5 lg:col-span-5 xl:col-span-6">
            <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-center">
              <span className="flex-1 text-left text-xl font-semibold">
                Overview
              </span>
              <Button
                type="button"
                variant={isStatsFilterActive ? "default" : "outline"}
                onClick={() => setStatsFilterOpen(true)}
                className="relative"
              >
                <Filter className="size-4" />
                Filters
                {isStatsFilterActive ? (
                  <span className="absolute -right-1 -top-1 size-2 rounded-full bg-primary-foreground ring-2 ring-primary" />
                ) : null}
              </Button>
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
                statsData?.map((card, idx) => (
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
            <DataBar data={paidGraph?.chart1} isLoading={paidGraphLoading} />
            <DataArea data={paidGraph?.chart2} isLoading={paidGraphLoading} />
          </div>
        </div>
        <div className="row-span-1 h-full w-full">
          <UserTable />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
