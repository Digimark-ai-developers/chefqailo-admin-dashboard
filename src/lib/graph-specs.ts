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

export const planChartData = [
  {
    month: "January",
    mealPlan: 12,
    inventory: 20,
    shoppingCart: 15,
    chefAI: 8,
    social: 10,
    extraTokens: 5,
  },
  {
    month: "February",
    mealPlan: 18,
    inventory: 25,
    shoppingCart: 20,
    chefAI: 10,
    social: 12,
    extraTokens: 8,
  },
  {
    month: "March",
    mealPlan: 22,
    inventory: 30,
    shoppingCart: 18,
    chefAI: 12,
    social: 14,
    extraTokens: 10,
  },
  {
    month: "April",
    mealPlan: 14,
    inventory: 18,
    shoppingCart: 12,
    chefAI: 7,
    social: 9,
    extraTokens: 6,
  },
  {
    month: "May",
    mealPlan: 20,
    inventory: 28,
    shoppingCart: 22,
    chefAI: 14,
    social: 16,
    extraTokens: 11,
  },
  {
    month: "June",
    mealPlan: 25,
    inventory: 35,
    shoppingCart: 30,
    chefAI: 18,
    social: 20,
    extraTokens: 15,
  },
];

export const planChartConfig = {
  mealPlan: {
    label: "Meal Plan",
    color: "hsl(var(--chart-1))",
  },
  inventory: {
    label: "Inventory",
    color: "hsl(var(--chart-2))",
  },
  shoppingCart: {
    label: "Cart",
    color: "hsl(var(--chart-3))",
  },
  chefAI: {
    label: "Chef AI",
    color: "hsl(var(--chart-4))",
  },
  social: {
    label: "Socializing",
    color: "hsl(var(--chart-5))",
  },
  extraTokens: {
    label: "Extra Tokens",
    color: "hsl(var(--chart-6))",
  },
} satisfies ChartConfig;
