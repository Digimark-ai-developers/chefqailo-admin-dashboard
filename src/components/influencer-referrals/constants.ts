export const pageSize = 10;

export const emptyOnboardingForm: InfluencerOnboardingPayload = {
  user: {
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    country: "",
    state: "",
  },
  influencer: {
    display_name: "",
    social_platform: "instagram",
    social_handle: "",
    is_active: true,
  },
  referral_code: {
    code: "",
    discount_percentage: "",
    max_redemptions: 0,
    valid_from: "",
    valid_until: "",
    is_active: true,
  },
};

export const emptyReferralForm: ReferralCodePayload = {
  influencer_id: 0,
  code: "",
  discount_percentage: "",
  max_redemptions: 0,
  valid_from: "",
  valid_until: "",
  is_active: true,
};
