import dayjs from "dayjs";

import { monthlyProgress } from "@/lib/constants";
import { cn } from "@/lib/utils";

const CalendarView = () => {
  const today = dayjs();
  const startOfMonth = today.startOf("month");
  const endOfMonth = today.endOf("month");

  const firstDayOfWeek = startOfMonth.day();
  const adjustedFirstDay = (firstDayOfWeek + 6) % 7;
  const totalDaysInMonth = endOfMonth.date();

  const prevMonthDays = Array.from({ length: adjustedFirstDay }, (_, idx) => {
    const day = startOfMonth.subtract(adjustedFirstDay - idx, "day").date();
    return {
      day,
      type: "prev",
      fullDate: startOfMonth
        .subtract(adjustedFirstDay - idx, "day")
        .format("DD-MM-YYYY"),
    };
  });

  const currentMonthDays = Array.from(
    { length: totalDaysInMonth },
    (_, idx) => {
      const date = startOfMonth.add(idx, "day");
      return {
        day: idx + 1,
        type: "current",
        fullDate: date.format("DD-MM-YYYY"),
      };
    }
  );

  const remainingCells = 42 - (prevMonthDays.length + currentMonthDays.length);
  const nextMonthDays = Array.from({ length: remainingCells }, (_, idx) => {
    const day = endOfMonth.add(idx + 1, "day").date();
    return {
      day,
      type: "next",
      fullDate: endOfMonth.add(idx + 1, "day").format("DD-MM-YYYY"),
    };
  });

  const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

  const getProgressForDay = (date: string) => {
    return monthlyProgress.find((item) => item.date === date)?.progress;
  };

  return (
    <div className="grid w-full grid-cols-7 gap-2.5 px-5">
      {allDays.map((day, idx) => {
        const progress = getProgressForDay(day.fullDate);
        const isCurrentMonth = day.type === "current";

        return (
          <div
            key={idx}
            className={cn(
              "col-span-1 flex h-[210px] w-full flex-col items-start justify-between rounded-md p-2.5 text-center",
              {
                "bg-primary text-white": isCurrentMonth && progress === 100,
                "border border-primary text-black dark:text-white":
                  isCurrentMonth && progress! < 100,
                "bg-black/15 dark:bg-black/30": !isCurrentMonth,
              }
            )}
          >
            <span>{day.day}</span>
            {isCurrentMonth && progress !== undefined && (
              <span>{progress}%</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CalendarView;
