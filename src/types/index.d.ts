declare type Card = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any | null;
  id?: number;
  name: string;
  rate: number;
  value: number;
  color: string;
  increase: boolean;
  chart: "views" | "inactive" | "active" | "tablet";
  tag: "users" | "monthly_sales_amount" | "total_sales";
};

declare type User = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  plan: "Free" | "Basic" | "Pro" | "Premium";
  is_active: boolean;
  createdAt: string;
  image: string;
};

declare type UsersResponse = {
  status_code: number;
  message: string;
  data: {
    total_users: number;
    users: User[];
  };
};

declare type PaidUserStats = {
  status_code: number;
  message: string;
  data: {
    paid: number;
    unpaid: number;
    total: number;
  };
};

declare type ActiveUserStats = {
  status_code: number;
  message: string;
  data: {
    period: string | null;
    active: number;
    inactive: number;
    total: number;
  };
};

declare type PostUser = {
  first_name: string;
  last_name: string;
  is_paid: boolean;
  image: File | null;
  email: string;
};

declare type EditUser = {
  id: number;
  body: PostUser;
};

declare type Plan = {
  id: number;
  name: string;
  price: number;
  users: number;
  trend: string;
  bgColor: string;
};
