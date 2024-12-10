declare type Card = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  id: number;
  name: string;
  rate: number;
  value: number;
  color: string;
  increase: boolean;
  chart: "views" | "desktop" | "mobile" | "tablet";
  tag: "users" | "monthly_sales_amount" | "total_sales";
};

declare type User = {
  id: number;
  name: string;
  email: string;
  is_paid: string;
};
