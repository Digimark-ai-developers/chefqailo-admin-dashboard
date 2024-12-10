import { type ClassValue, clsx } from "clsx";
import { type Dayjs } from "dayjs";
import { twMerge } from "tailwind-merge";

export type ActiveTab = "week" | "month" | "year";
type Direction = "previous" | "next";

export type DateRange = {
  startDate: Dayjs;
  endDate: Dayjs;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number | string) {
  return new Intl.NumberFormat().format(Number(value));
}

export function truncateString(str: string, num: number) {
  return str.length > num ? `${str.slice(0, num)}...` : str;
}

export function getUpdatedDateRange(
  activeTab: ActiveTab,
  currentRange: DateRange,
  direction: Direction
) {
  const { startDate } = currentRange;

  let newStartDate: Dayjs;

  switch (activeTab) {
    case "week":
      newStartDate =
        direction === "next"
          ? startDate.add(7, "day")
          : startDate.subtract(7, "day");
      break;

    case "month":
      newStartDate =
        direction === "next"
          ? startDate.add(1, "month")
          : startDate.subtract(1, "month");
      break;

    case "year":
      newStartDate =
        direction === "next"
          ? startDate.add(1, "year")
          : startDate.subtract(1, "year");
      break;

    default:
      throw new Error("Invalid activeTab value");
  }

  let newEndDate: Dayjs;

  switch (activeTab) {
    case "week":
      newEndDate = newStartDate.add(6, "day");
      break;

    case "month":
      newEndDate = newStartDate.endOf("month");
      break;

    case "year":
      newEndDate = newStartDate.endOf("year");
      break;
  }

  return {
    startDate: newStartDate.startOf(activeTab),
    endDate: newEndDate,
  };
}
