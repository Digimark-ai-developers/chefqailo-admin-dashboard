import { useState } from "react";

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
import { cards } from "@/lib/constants";
import { lineChartConfig } from "@/lib/dashboard-graph-specs";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const { open } = useSidebar();
  const [activeChart, setActiveChart] =
    useState<keyof typeof lineChartConfig>("inactive");
  const [selectedStat, setSelectedStat] = useState<
    "users" | "monthly_sales_amount" | "total_sales"
  >("users");
  const [position, setPosition] = useState<string>("weekly");

  const clickEvent = (
    chart: "views" | "inactive" | "active" | "tablet",
    stat: "users" | "monthly_sales_amount" | "total_sales"
  ) => {
    setSelectedStat(stat);
    setActiveChart(chart);
  };

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
                  <DropdownMenuRadioItem value="annually">
                    Annually
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div
            className={cn(
              "grid h-fit w-full grid-cols-1 rounded-lg bg-muted p-2.5 md:grid-cols-3",
              {
                "gap-0 xl:gap-2.5": open,
                "gap-2.5": !open,
              }
            )}
          >
            {cards.map((card) => (
              <StatCard
                card={card}
                key={card.id}
                selectedStat={selectedStat}
                clickEvent={() => clickEvent(card.chart, card.tag)}
              />
            ))}
          </div>
          <div className="h-full w-full">
            <DataLine activeChart={activeChart} />
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
