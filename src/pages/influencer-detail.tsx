import { useEffect, useState } from "react";

import { ArrowLeft, ArrowUpRight } from "lucide-react";
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
  getInfluencerUserId,
  isReferralValid,
} from "@/components/influencer-referrals/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminAccessToken } from "@/hooks/use-admin-access-token";
import {
  useGetInfluencerAnalyticsQuery,
  useGetInfluencerQuery,
  useGetReferralCodesQuery,
} from "@/store/services/referrals";

const InfluencerDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const influencerId = Number(id);
  const accessToken = useAdminAccessToken();

  const influencerQuery = useGetInfluencerQuery(
    { id: influencerId, token: accessToken },
    {
      skip: !accessToken || !influencerId,
      refetchOnMountOrArgChange: true,
    }
  );
  const analyticsQuery = useGetInfluencerAnalyticsQuery(
    { id: influencerId, token: accessToken },
    {
      skip: !accessToken || !influencerId,
      refetchOnMountOrArgChange: true,
    }
  );
  const referralCodesQuery = useGetReferralCodesQuery(
    {
      page: 1,
      pageSize: 100,
      token: accessToken,
      influencerId,
    },
    {
      skip: !accessToken || !influencerId,
      refetchOnMountOrArgChange: true,
    }
  );

  const influencer = influencerQuery.data;
  const user =
    typeof influencer?.user === "object" ? influencer.user : undefined;
  const embeddedReferralCodes = influencer?.referral_codes ?? [];
  const fetchedReferralCodes = (referralCodesQuery.data?.results ?? []).filter(
    (code) => {
      if (code.influencer_id) {
        return code.influencer_id === influencerId;
      }

      if (typeof code.influencer === "number") {
        return code.influencer === influencerId;
      }

      return code.influencer?.id === influencerId;
    }
  );
  const referralCodes = mergeReferralCodes(
    embeddedReferralCodes,
    fetchedReferralCodes
  );
  const referralsLoading =
    referralCodesQuery.isLoading || referralCodesQuery.isFetching;
  const activeReferralCodes = referralCodes.filter((code) => code.is_active);
  const totalRedemptions = referralCodes.reduce(
    (total, code) => total + (code.current_redemptions ?? 0),
    0
  );

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
            {influencer?.display_name ?? "Influencer Detail"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Profile details, referral codes, and referral analytics.
          </p>
        </div>
      </div>

      {influencerQuery.isLoading || influencerQuery.isFetching ? (
        <LoadingState />
      ) : influencer ? (
        <div className="grid gap-5">
          <section className="grid gap-3">
            <h2 className="text-sm font-semibold">Analytics</h2>
            {analyticsQuery.isLoading || analyticsQuery.isFetching ? (
              <LoadingState />
            ) : analyticsQuery.data ? (
              <div className="grid gap-4 md:grid-cols-4">
                <MetricCard
                  label="Total codes"
                  value={String(
                    analyticsQuery.data.total_codes || referralCodes.length
                  )}
                />
                <MetricCard
                  label="Total redemptions"
                  value={String(
                    analyticsQuery.data.total_redemptions || totalRedemptions
                  )}
                />
                <MetricCard
                  label="Active codes"
                  value={String(activeReferralCodes.length)}
                />
                <MetricCard
                  label="Subscription revenue"
                  value={`$${analyticsQuery.data.total_subscription_revenue}`}
                />
                <MetricCard
                  label="Discount given"
                  value={`$${analyticsQuery.data.total_discount_given}`}
                />
              </div>
            ) : (
              <EmptyState message="No analytics found." />
            )}
          </section>

          <section className="grid gap-3">
            <h2 className="text-sm font-semibold">View</h2>
            <div className="grid gap-3 md:grid-cols-3">
              <DetailItem
                label="Display name"
                value={influencer.display_name}
              />
              <DetailItem
                label="User ID"
                value={String(getInfluencerUserId(influencer))}
              />
              <DetailItem
                label="Social platform"
                value={influencer.social_platform}
              />
              <DetailItem
                label="Social handle"
                value={influencer.social_handle}
              />
              <DetailItem
                label="Active"
                value={influencer.is_active ? "Active" : "Inactive"}
              />
              <DetailItem
                label="Created at"
                value={formatDate(influencer.created_at)}
              />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <DetailItem label="Username" value={user?.username ?? "-"} />
              <DetailItem label="Email" value={user?.email ?? "-"} />
              <DetailItem
                label="Name"
                value={
                  `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() ||
                  "-"
                }
              />
              <DetailItem label="Phone" value={user?.phone_number ?? "-"} />
              <DetailItem label="Role" value={user?.role ?? "-"} />
              <DetailItem label="Country" value={user?.country ?? "-"} />
              <DetailItem label="State" value={user?.state ?? "-"} />
            </div>
          </section>

          <section className="grid gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold">Referrals</h2>
              <span className="text-sm text-muted-foreground">
                {referralCodes.length} code{referralCodes.length === 1 ? "" : "s"}
              </span>
            </div>
            {referralsLoading && !referralCodes.length ? (
              <LoadingState />
            ) : referralCodes.length ? (
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Redemptions</TableHead>
                      <TableHead>Valid window</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead>Valid</TableHead>
                      <TableHead className="w-24 text-right">Detail</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referralCodes.map((code) => (
                      <TableRow
                        key={code.id}
                        className="cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                          navigate(
                            `/influencer-referrals/referral-codes/${code.id}`
                          )
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            navigate(
                              `/influencer-referrals/referral-codes/${code.id}`
                            );
                          }
                        }}
                      >
                        <TableCell className="font-medium">
                          {code.code}
                        </TableCell>
                        <TableCell>{code.discount_percentage}%</TableCell>
                        <TableCell>
                          {code.current_redemptions ?? 0}/{code.max_redemptions}
                        </TableCell>
                        <TableCell>
                          {formatDate(code.valid_from)} -{" "}
                          {formatDate(code.valid_until)}
                        </TableCell>
                        <TableCell>
                          <StatusPill active={code.is_active} />
                        </TableCell>
                        <TableCell>
                          <ValidPill valid={isReferralValid(code)} />
                        </TableCell>
                        <TableCell
                          className="text-right"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate(
                                `/influencer-referrals/referral-codes/${code.id}`
                              )
                            }
                          >
                            Open
                            <ArrowUpRight />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <EmptyState message="No referral summary available." />
            )}
          </section>
        </div>
      ) : (
        <EmptyState message="Influencer detail was not found." />
      )}
    </div>
  );
};

const mergeReferralCodes = (
  embedded: ReferralCode[],
  fetched: ReferralCode[]
) => {
  const codes = new Map<number, ReferralCode>();

  [...embedded, ...fetched].forEach((code) => {
    codes.set(code.id, code);
  });

  return Array.from(codes.values());
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

export default InfluencerDetail;
