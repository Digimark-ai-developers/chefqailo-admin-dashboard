import { ChartConfig } from "@/components/ui/chart";

export const lineChartData = [
  { date: "2024-04-01", inactive: 222, active: 150, tablet: 301 },
  { date: "2024-04-02", inactive: 97, active: 180, tablet: 438 },
  { date: "2024-04-03", inactive: 167, active: 120, tablet: 254 },
  { date: "2024-04-04", inactive: 242, active: 260, tablet: 121 },
  { date: "2024-04-05", inactive: 373, active: 290, tablet: 452 },
  { date: "2024-04-06", inactive: 301, active: 340, tablet: 365 },
  { date: "2024-04-07", inactive: 245, active: 180, tablet: 298 },
  { date: "2024-04-08", inactive: 409, active: 320, tablet: 127 },
  { date: "2024-04-09", inactive: 59, active: 110, tablet: 381 },
  { date: "2024-04-10", inactive: 261, active: 190, tablet: 458 },
  { date: "2024-04-11", inactive: 327, active: 350, tablet: 95 },
  { date: "2024-04-12", inactive: 292, active: 210, tablet: 241 },
  { date: "2024-04-13", inactive: 342, active: 380, tablet: 475 },
  { date: "2024-04-14", inactive: 137, active: 220, tablet: 310 },
  { date: "2024-04-15", inactive: 120, active: 170, tablet: 173 },
  { date: "2024-04-16", inactive: 138, active: 190, tablet: 293 },
  { date: "2024-04-17", inactive: 446, active: 360, tablet: 467 },
  { date: "2024-04-18", inactive: 364, active: 410, tablet: 222 },
  { date: "2024-04-19", inactive: 243, active: 180, tablet: 328 },
  { date: "2024-04-20", inactive: 89, active: 150, tablet: 412 },
  { date: "2024-04-21", inactive: 137, active: 200, tablet: 269 },
  { date: "2024-04-22", inactive: 224, active: 170, tablet: 498 },
  { date: "2024-04-23", inactive: 138, active: 230, tablet: 76 },
  { date: "2024-04-24", inactive: 387, active: 290, tablet: 382 },
  { date: "2024-04-25", inactive: 215, active: 250, tablet: 135 },
  { date: "2024-04-26", inactive: 75, active: 130, tablet: 195 },
  { date: "2024-04-27", inactive: 383, active: 420, tablet: 252 },
  { date: "2024-04-28", inactive: 122, active: 180, tablet: 343 },
  { date: "2024-04-29", inactive: 315, active: 240, tablet: 77 },
  { date: "2024-04-30", inactive: 454, active: 380, tablet: 404 },
  { date: "2024-05-01", inactive: 165, active: 220, tablet: 132 },
  { date: "2024-05-02", inactive: 293, active: 310, tablet: 476 },
  { date: "2024-05-03", inactive: 247, active: 190, tablet: 295 },
  { date: "2024-05-04", inactive: 385, active: 420, tablet: 89 },
  { date: "2024-05-05", inactive: 481, active: 390, tablet: 174 },
  { date: "2024-05-06", inactive: 498, active: 520, tablet: 322 },
  { date: "2024-05-07", inactive: 388, active: 300, tablet: 437 },
  { date: "2024-05-08", inactive: 149, active: 210, tablet: 107 },
  { date: "2024-05-09", inactive: 227, active: 180, tablet: 288 },
  { date: "2024-05-10", inactive: 293, active: 330, tablet: 373 },
  { date: "2024-05-11", inactive: 335, active: 270, tablet: 112 },
  { date: "2024-05-12", inactive: 197, active: 240, tablet: 408 },
  { date: "2024-05-13", inactive: 197, active: 160, tablet: 372 },
  { date: "2024-05-14", inactive: 448, active: 490, tablet: 215 },
  { date: "2024-05-15", inactive: 473, active: 380, tablet: 342 },
  { date: "2024-05-16", inactive: 338, active: 400, tablet: 282 },
  { date: "2024-05-17", inactive: 499, active: 420, tablet: 321 },
  { date: "2024-05-18", inactive: 315, active: 350, tablet: 268 },
  { date: "2024-05-19", inactive: 235, active: 180, tablet: 403 },
  { date: "2024-05-20", inactive: 177, active: 230, tablet: 359 },
  { date: "2024-05-21", inactive: 82, active: 140, tablet: 485 },
  { date: "2024-05-22", inactive: 81, active: 120, tablet: 101 },
  { date: "2024-05-23", inactive: 252, active: 290, tablet: 418 },
  { date: "2024-05-24", inactive: 294, active: 220, tablet: 217 },
  { date: "2024-05-25", inactive: 201, active: 250, tablet: 366 },
  { date: "2024-05-26", inactive: 213, active: 170, tablet: 432 },
  { date: "2024-05-27", inactive: 420, active: 460, tablet: 147 },
  { date: "2024-05-28", inactive: 233, active: 190, tablet: 176 },
  { date: "2024-05-29", inactive: 78, active: 130, tablet: 84 },
  { date: "2024-05-30", inactive: 340, active: 280, tablet: 482 },
  { date: "2024-05-31", inactive: 178, active: 230, tablet: 101 },
  { date: "2024-06-01", inactive: 178, active: 200, tablet: 356 },
  { date: "2024-06-02", inactive: 470, active: 410, tablet: 247 },
  { date: "2024-06-03", inactive: 103, active: 160, tablet: 344 },
  { date: "2024-06-04", inactive: 439, active: 380, tablet: 109 },
  { date: "2024-06-05", inactive: 88, active: 140, tablet: 426 },
  { date: "2024-06-06", inactive: 294, active: 250, tablet: 189 },
  { date: "2024-06-07", inactive: 323, active: 370, tablet: 357 },
  { date: "2024-06-08", inactive: 385, active: 320, tablet: 491 },
  { date: "2024-06-09", inactive: 438, active: 480, tablet: 94 },
  { date: "2024-06-10", inactive: 155, active: 200, tablet: 422 },
  { date: "2024-06-11", inactive: 92, active: 150, tablet: 351 },
  { date: "2024-06-12", inactive: 492, active: 420, tablet: 278 },
  { date: "2024-06-13", inactive: 81, active: 130, tablet: 319 },
  { date: "2024-06-14", inactive: 426, active: 410, tablet: 469 },
];

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
  { month: "January", inactive: 186, active: 80 },
  { month: "February", inactive: 305, active: 200 },
  { month: "March", inactive: 237, active: 120 },
  { month: "April", inactive: 73, active: 190 },
  { month: "May", inactive: 209, active: 130 },
  { month: "June", inactive: 214, active: 140 },
];

export const barChartConfig = {
  inactive: {
    label: "inactive",
    color: "hsl(var(--chart-1))",
  },
  active: {
    label: "active",
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
