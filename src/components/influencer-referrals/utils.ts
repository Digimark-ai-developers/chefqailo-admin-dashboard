export const getApiError = (error: unknown) => {
  if (error && typeof error === "object" && "data" in error) {
    const data = (error as { data?: unknown }).data;

    if (data && typeof data === "object") {
      if ("message" in data && typeof data.message === "string") {
        return data.message;
      }

      if ("detail" in data && typeof data.detail === "string") {
        return data.detail;
      }

      return JSON.stringify(data);
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please review the request and try again.";
};

export const formatDate = (value?: string) => {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

export const toInputDate = (value?: string) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 16);
};

export const toIsoDate = (value: string) => {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString();
};

export const getInfluencerUserId = (influencer: Influencer) => {
  if (typeof influencer.user === "number") {
    return influencer.user;
  }

  return influencer.user_id ?? influencer.user?.id ?? "-";
};

export const getInfluencerName = (referral: ReferralCode) => {
  if (referral.influencer_name) {
    return referral.influencer_name;
  }

  if (typeof referral.influencer === "object") {
    return referral.influencer.display_name;
  }

  return referral.influencer_id ?? referral.influencer ?? "-";
};

export const isReferralValid = (referral: ReferralCode) =>
  referral.is_valid ?? referral.valid ?? false;
