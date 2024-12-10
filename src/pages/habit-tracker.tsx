import { useState } from "react";

import dayjs from "dayjs";
import {
  CircleArrowLeft,
  CircleArrowRight,
  TrendingUp,
  User,
} from "lucide-react";

import CalendarView from "@/components/habit-tracker/calendar-view";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ui/progress-bar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserBar from "@/components/users/user-bar";
import { weeklyProgress, yearlyProgress } from "@/lib/constants";
import {
  type ActiveTab,
  type DateRange,
  cn,
  getUpdatedDateRange,
} from "@/lib/utils";

const HabitTracker = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: dayjs().startOf("week"),
    endDate: dayjs().endOf("week"),
  });
  const [activeTab, setActiveTab] = useState<string>("week");

  const handleNavigation = (direction: "previous" | "next") => {
    const updatedRange = getUpdatedDateRange(
      activeTab as ActiveTab,
      dateRange,
      direction
    );
    setDateRange(updatedRange);
  };

  return (
    <>
      <UserBar open={open} setOpen={setOpen} />
      <div className="flex h-full w-full flex-col items-start justify-start gap-5">
        <div className="flex w-full items-center justify-center border-b pb-5">
          <span className="flex-1 text-left text-3xl font-bold">
            Habit Tracker
          </span>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex h-full w-full flex-col items-start justify-start gap-5">
          <div className="flex w-full items-center justify-center">
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
            <Button
              type="button"
              variant="default"
              size="icon"
              onClick={() => setOpen(true)}
            >
              <User />
            </Button>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-2">
            <div className="flex w-full items-center justify-center">
              <p className="flex flex-1 text-left text-xs font-medium">
                <span className="flex gap-1 text-green-500">
                  <TrendingUp className="size-4" /> 50%
                </span>
                &nbsp;from the {activeTab} before
              </p>
              <span className="text-right text-xs font-medium">
                86% Achieved
              </span>
            </div>
            <ProgressBar width={86} />
          </div>
          <div className="relative flex h-full max-h-[715px] w-full flex-col items-start justify-start gap-5 overflow-y-auto rounded-xl bg-muted pb-5">
            {activeTab === "week" && (
              <>
                <div className="sticky top-0 z-10 grid w-full grid-cols-12 items-center bg-muted pt-5">
                  <div className="col-span-4" />
                  <div className="col-span-1">Mon</div>
                  <div className="col-span-1">Tue</div>
                  <div className="col-span-1">Wed</div>
                  <div className="col-span-1">Thu</div>
                  <div className="col-span-1">Fri</div>
                  <div className="col-span-1">Sat</div>
                  <div className="col-span-1">Sun</div>
                  <div className="col-span-1" />
                </div>
                {weeklyProgress.map((item) => (
                  <div
                    key={item.id}
                    className="grid w-full grid-cols-12 items-center px-5"
                  >
                    <div className="col-span-4">{item.name}</div>
                    {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(
                      (day, idx) => (
                        <div key={idx} className="col-span-1">
                          <div
                            className={cn("size-5 rounded-md", {
                              "bg-primary": item[day as keyof typeof item],
                              "border border-primary dark:border-white":
                                !item[day as keyof typeof item],
                            })}
                          />
                        </div>
                      )
                    )}
                    <div className="col-span-1">
                      <div
                        className="size-10 rounded-full bg-transparent"
                        style={{
                          background: `conic-gradient(#F97316 ${
                            (Object.values(item).filter(
                              (value) => value === true
                            ).length /
                              7) *
                            100
                          }%, #696969 0)`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </>
            )}
            {activeTab === "month" && (
              <>
                <div className="sticky top-0 z-10 grid w-full grid-cols-7 items-center bg-muted px-5 pt-5">
                  <div className="col-span-1 w-full text-center">Mon</div>
                  <div className="col-span-1 w-full text-center">Tue</div>
                  <div className="col-span-1 w-full text-center">Wed</div>
                  <div className="col-span-1 w-full text-center">Thu</div>
                  <div className="col-span-1 w-full text-center">Fri</div>
                  <div className="col-span-1 w-full text-center">Sat</div>
                  <div className="col-span-1 w-full text-center">Sun</div>
                </div>
                <CalendarView />
              </>
            )}
            {activeTab === "year" && (
              <div className="flex w-full flex-col items-start justify-start gap-5 p-5">
                {yearlyProgress.map((item) => (
                  <div
                    key={item.id}
                    className="flex w-full items-center justify-center gap-5"
                  >
                    <span className="w-40 overflow-hidden truncate">
                      {item.name}
                    </span>
                    <ProgressBar width={item.progress} />
                    <span className="w-14 overflow-hidden truncate">
                      {Math.round(item.progress / (100 / 12))} / 12
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HabitTracker;
