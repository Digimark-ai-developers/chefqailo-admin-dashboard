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
  payment_status: "Free" | "Basic" | "Pro" | "Premium";
  is_active: boolean;
  image: string;
  createdAt: string;
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
  payment_status: string;
  amount: number;
  users: number;
  bgColor: string;
};

declare type OverallStats = {
  date: string;
  meal_plan_count: number;
  inventory_count: number;
  chat_history_count: number;
  culinary_recipe_count: number;
  token_tracking_count: number;
  shopping_count: number;
};

declare type SubscriptionStats = {
  date: string;
  free: number;
  basic: number;
  pro: number;
  premium: number;
};

declare type ApiEnvelope<T> = {
  status_code?: number;
  message?: string;
  data?: T;
};

declare type ApiMessage<T = unknown> = ApiEnvelope<T> & {
  message?: string;
};

declare type PaginatedResponse<T> = {
  count: number;
  next?: string | null;
  page?: number;
  limit?: number;
  previous?: string | null;
  results: T[];
  total_pages?: number;
};

declare type InfluencerUserPayload = {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  country: string;
  state: string;
};

declare type InfluencerProfilePayload = {
  display_name: string;
  social_platform: string;
  social_handle: string;
  is_active: boolean;
};

declare type ReferralCodePayload = {
  influencer_id: number;
  code: string;
  discount_percentage: string;
  max_redemptions: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
};

declare type InitialReferralCodePayload = Omit<
  ReferralCodePayload,
  "influencer_id"
>;

declare type InfluencerOnboardingPayload = {
  user: InfluencerUserPayload;
  influencer: InfluencerProfilePayload;
  referral_code: InitialReferralCodePayload;
};

declare type ReferralUser = {
  id?: number;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  country?: string;
  state?: string;
};

declare type Influencer = {
  id: number;
  display_name: string;
  user_id?: number;
  user?: ReferralUser | number;
  social_platform: string;
  social_handle: string;
  is_active: boolean;
  created_at?: string;
};

declare type InfluencerDetail = Influencer & {
  referral_codes?: ReferralCode[];
};

declare type ReferralCode = {
  id: number;
  influencer_id?: number;
  influencer?: Influencer | number;
  influencer_name?: string;
  code: string;
  discount_percentage: string;
  current_redemptions?: number;
  max_redemptions: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  is_valid?: boolean;
  valid?: boolean;
  invalid_reason?: string | null;
};

declare type ReferralCodeDetail = ReferralCode;

declare type InfluencerAnalytics = {
  influencer_id: number;
  total_codes: number;
  total_redemptions: number;
  total_discount_given: string;
  total_subscription_revenue: string;
};

declare type ReferralValidationResponse = {
  valid: boolean;
  discount_percentage?: string;
  influencer_name?: string;
  message: string;
};

declare type AdminLoginPayload = {
  email: string;
  password: string;
};

declare type AdminLoginResponse = {
  access?: string;
  access_token?: string;
  token?: string;
  accessToken?: string;
  message?: string;
  data?: {
    access?: string;
    access_token?: string;
    token?: string;
    tokens?: {
      access?: string;
    };
  };
};
