import { useMemo } from "react";

import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import {
  DetailItem,
  EmptyState,
  LoadingState,
  StatusPill,
  ValidPill,
} from "@/components/influencer-referrals/shared";
import {
  formatDate,
  getInfluencerName,
  isReferralValid,
} from "@/components/influencer-referrals/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAccessToken } from "@/hooks/use-admin-access-token";
import {
  useGetReferralCodePerformanceQuery,
  useGetReferralCodeQuery,
} from "@/store/services/referrals";

const ReferralCodeDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const referralCodeId = Number(id);
  const accessToken = useAdminAccessToken();

  const referralQuery = useGetReferralCodeQuery(
    { id: referralCodeId, token: accessToken },
    {
      skip: !accessToken || !referralCodeId,
      refetchOnMountOrArgChange: true,
    }
  );
  const performanceQuery = useGetReferralCodePerformanceQuery(
    { id: referralCodeId, token: accessToken },
    {
      skip: !accessToken || !referralCodeId,
      refetchOnMountOrArgChange: true,
    }
  );

  const referral = referralQuery.data;
  const performance = performanceQuery.data;
  const assumptions = useMemo(() => {
    if (!performance?.assumptions) {
      return [];
    }

    return [
      {
        label: "Paid plans",
        value: performance.assumptions.paid_plans.join(", "),
      },
      {
        label: "Renewal rule",
        value: performance.assumptions.renewal_rule,
      },
      {
        label: "Platform fees",
        value: Object.entries(
          performance.assumptions.default_platform_fee_percentages
        )
          .map(([platform, fee]) => `${platform}: ${fee}%`)
          .join(", "),
      },
      {
        label: "Net revenue rule",
        value: performance.assumptions.net_revenue_rule,
      },
    ];
  }, [performance]);

  return (
    <div className="flex h-full w-full flex-col gap-5 overflow-y-auto pr-1">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate("/influencer-referrals")}
        >
          <ArrowLeft />
          Back
        </Button>
        <div className="min-w-0">
          <h1 className="text-xl font-semibold">
            {referral?.code ?? performance?.code ?? "Referral Code Detail"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Referral code details and performance metrics.
          </p>
        </div>
      </div>

      {referralQuery.isLoading || referralQuery.isFetching ? (
        <LoadingState />
      ) : referral ? (
        <div className="grid gap-5">
          <section className="grid gap-3">
            <h2 className="text-sm font-semibold">View</h2>
            <div className="grid gap-3 md:grid-cols-3">
              <DetailItem label="ID" value={String(referral.id)} />
              <DetailItem label="Code" value={referral.code} />
              <DetailItem
                label="Influencer"
                value={String(getInfluencerName(referral))}
              />
              <DetailItem
                label="Discount"
                value={`${referral.discount_percentage}%`}
              />
              <DetailItem
                label="Redemptions"
                value={`${referral.current_redemptions ?? 0}/${referral.max_redemptions}`}
              />
              <DetailItem
                label="Valid from"
                value={formatDate(referral.valid_from)}
              />
              <DetailItem
                label="Valid until"
                value={formatDate(referral.valid_until)}
              />
              <DetailItem
                label="Active"
                value={referral.is_active ? "Active" : "Inactive"}
              />
              <DetailItem
                label="Valid"
                value={isReferralValid(referral) ? "Valid" : "Invalid"}
              />
              <DetailItem
                label="Invalid reason"
                value={referral.invalid_reason || "-"}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusPill active={referral.is_active} />
              <ValidPill valid={isReferralValid(referral)} />
            </div>
          </section>

          <section className="grid gap-3">
            <h2 className="text-sm font-semibold">Analytics</h2>
            {performanceQuery.isLoading || performanceQuery.isFetching ? (
              <LoadingState />
            ) : performance ? (
              <div className="grid gap-4 md:grid-cols-4">
                <MetricCard
                  label="Standard conversions"
                  value={String(performance.standard_conversions)}
                />
                <MetricCard
                  label="Premium conversions"
                  value={String(performance.premium_conversions)}
                />
                <MetricCard
                  label="Active subscriptions"
                  value={String(performance.active_subscriptions)}
                />
                <MetricCard
                  label="Renewals"
                  value={String(performance.renewals)}
                />
                <MetricCard
                  label="Gross revenue"
                  value={formatMoney(
                    performance.revenue_generated.gross,
                    performance.revenue_generated.currency
                  )}
                />
                <MetricCard
                  label="Net revenue"
                  value={formatMoney(
                    performance.revenue_generated.net,
                    performance.revenue_generated.currency
                  )}
                />
              </div>
            ) : (
              <EmptyState message="No performance metrics found." />
            )}
          </section>

          {assumptions.length ? (
            <section className="grid gap-3">
              <h2 className="text-sm font-semibold">Assumptions</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {assumptions.map((item) => (
                  <DetailItem
                    key={item.label}
                    label={item.label}
                    value={item.value || "-"}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      ) : (
        <EmptyState message="Referral code detail was not found." />
      )}
    </div>
  );
};

const formatMoney = (value: string, currency: string) => {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return `${value} ${currency}`;
  }

  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
  }).format(amount);
};

const MetricCard = ({ label, value }: { label: string; value: string }) => (
  <Card className="rounded-md">
    <CardHeader className="p-4 pb-2">
      <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
    </CardHeader>
    <CardContent className="p-4 pt-0 text-2xl font-semibold">
      {value}
    </CardContent>
  </Card>
);

export default ReferralCodeDetail;
