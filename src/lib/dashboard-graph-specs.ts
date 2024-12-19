import { ChartConfig } from "@/components/ui/chart";

export const lineChartConfig = {
  views: {
    label: "Page Views",
  },
  inactive: {
    label: "inactive",
    color: "hsl(var(--chart-1))",
  },
  active: {
    label: "active",
    color: "hsl(var(--chart-2))",
  },
  tablet: {
    label: "Tablet",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export const barChartData = [
  { month: "January", unpaid: 186, paid: 80 },
  { month: "February", unpaid: 305, paid: 200 },
  { month: "March", unpaid: 237, paid: 120 },
  { month: "April", unpaid: 73, paid: 190 },
  { month: "May", unpaid: 209, paid: 130 },
  { month: "June", unpaid: 214, paid: 140 },
];

export const barChartConfig = {
  unpaid: {
    label: "unpaid",
    color: "hsl(var(--chart-1))",
  },
  paid: {
    label: "paid",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export const areaChartData = [
  { month: "January", inactive: 186, active: 80 },
  { month: "February", inactive: 305, active: 200 },
  { month: "March", inactive: 237, active: 120 },
  { month: "April", inactive: 73, active: 190 },
  { month: "May", inactive: 209, active: 130 },
  { month: "June", inactive: 214, active: 140 },
];

export const areaChartConfig = {
  inactive: {
    label: "inactive",
    color: "hsl(var(--chart-1))",
  },
  active: {
    label: "active",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export const paymentHistoryData = [
  { month: "January", amount: 186 },
  { month: "February", amount: 305 },
  { month: "March", amount: 237 },
  { month: "April", amount: 73 },
  { month: "May", amount: 209 },
  { month: "June", amount: 214 },
];

export const paymentHistoryConfig = {
  amount: {
    label: "Amount",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;
