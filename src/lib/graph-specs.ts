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
    date: "January",
    meal_plan_count: 12,
    inventory_count: 20,
    shopping_count: 15,
    chat_history_count: 8,
    culinary_recipe_count: 10,
    token_tracking_count: 5,
  },
  {
    date: "February",
    meal_plan_count: 18,
    inventory_count: 25,
    shopping_count: 20,
    chat_history_count: 10,
    culinary_recipe_count: 12,
    token_tracking_count: 8,
  },
  {
    date: "March",
    meal_plan_count: 22,
    inventory_count: 30,
    shopping_count: 18,
    chat_history_count: 12,
    culinary_recipe_count: 14,
    token_tracking_count: 10,
  },
  {
    date: "April",
    meal_plan_count: 14,
    inventory_count: 18,
    shopping_count: 12,
    chat_history_count: 7,
    culinary_recipe_count: 9,
    token_tracking_count: 6,
  },
  {
    date: "May",
    meal_plan_count: 20,
    inventory_count: 28,
    shopping_count: 22,
    chat_history_count: 14,
    culinary_recipe_count: 16,
    token_tracking_count: 11,
  },
  {
    date: "June",
    meal_plan_count: 25,
    inventory_count: 35,
    shopping_count: 30,
    chat_history_count: 18,
    culinary_recipe_count: 20,
    token_tracking_count: 15,
  },
];

export const planChartConfig = {
  meal_plan_count: {
    label: "Meal Plan",
    color: "hsl(var(--chart-1))",
  },
  inventory_count: {
    label: "Inventory",
    color: "hsl(var(--chart-2))",
  },
  shopping_count: {
    label: "Cart",
    color: "hsl(var(--chart-3))",
  },
  chat_history_count: {
    label: "Chef AI",
    color: "hsl(var(--chart-4))",
  },
  culinary_recipe_count: {
    label: "Socializing",
    color: "hsl(var(--chart-5))",
  },
  token_tracking_count: {
    label: "Extra Tokens",
    color: "hsl(var(--chart-6))",
  },
} satisfies ChartConfig;

export const mealUsageChartData = [
  { date: "August", count: 186 },
  { date: "September", count: 305 },
  { date: "October", count: 237 },
  { date: "November", count: 73 },
  { date: "December", count: 209 },
  { date: "January", count: 214 },
];

export const mealUsageChartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export const peakMealChartData = [
  { date: "January", count: 186 },
  { date: "February", count: 305 },
  { date: "March", count: 237 },
  { date: "April", count: 73 },
  { date: "May", count: 209 },
  { date: "June", count: 214 },
];

export const peakMealChartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export const subscriptionChartData = [
  {
    date: "January",
    free: 186,
    basic: 80,
    pro: Math.floor(Math.random() * 100),
    premium: Math.floor(Math.random() * 50),
  },
  {
    date: "February",
    free: 305,
    basic: 200,
    pro: Math.floor(Math.random() * 100),
    premium: Math.floor(Math.random() * 50),
  },
  {
    date: "March",
    free: 237,
    basic: 120,
    pro: Math.floor(Math.random() * 100),
    premium: Math.floor(Math.random() * 50),
  },
  {
    date: "April",
    free: 73,
    basic: 190,
    pro: Math.floor(Math.random() * 100),
    premium: Math.floor(Math.random() * 50),
  },
  {
    date: "May",
    free: 209,
    basic: 130,
    pro: Math.floor(Math.random() * 100),
    premium: Math.floor(Math.random() * 50),
  },
  {
    date: "June",
    free: 214,
    basic: 140,
    pro: Math.floor(Math.random() * 100),
    premium: Math.floor(Math.random() * 50),
  },
];

export const subscriptionChartConfig = {
  free: {
    label: "Free",
    color: "hsl(var(--chart-1))",
  },
  basic: {
    label: "Basic",
    color: "hsl(var(--chart-2))",
  },
  pro: {
    label: "Pro",
    color: "hsl(var(--chart-3))",
  },
  premium: {
    label: "Premium",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;
