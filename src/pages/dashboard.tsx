import { useState } from "react";

import DataBar from "@/components/dashboard/data-bar";
import DataLine from "@/components/dashboard/data-line";
import DataRadial from "@/components/dashboard/data-radial";
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
    useState<keyof typeof lineChartConfig>("desktop");
  const [selectedStat, setSelectedStat] = useState<
    "users" | "monthly_sales_amount" | "total_sales"
  >("users");
  const [position, setPosition] = useState<string>("weekly");

  const clickEvent = (
    chart: "views" | "desktop" | "mobile" | "tablet",
    stat: "users" | "monthly_sales_amount" | "total_sales"
  ) => {
    setSelectedStat(stat);
    setActiveChart(chart);
  };

  return (
    <div className="flex max-h-full w-full flex-col items-start justify-start gap-5 overflow-y-auto lg:overflow-hidden">
      <div className="grid w-full grid-cols-2 items-start justify-start gap-4 lg:grid-cols-8">
        <div className="col-span-2 flex h-full w-full flex-col items-start justify-start gap-5 rounded-xl border bg-background p-5 shadow lg:col-span-6">
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
              "grid w-full grid-cols-1 rounded-xl bg-muted p-2.5 md:grid-cols-3",
              {
                "gap-0 xl:gap-5": open,
                "gap-5": !open,
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
        <div className="col-span-2 flex h-full w-full flex-col items-center justify-center gap-5 rounded-xl md:grid md:grid-cols-2 lg:flex lg:flex-col">
          <DataRadial />
          <DataBar />
        </div>
      </div>
      <UserTable />
    </div>
  );
};

export default Dashboard;
