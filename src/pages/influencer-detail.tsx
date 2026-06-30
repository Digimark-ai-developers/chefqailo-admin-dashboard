import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import {
  DetailItem,
  EmptyState,
  LoadingState,
  StatusPill,
} from "@/components/influencer-referrals/shared";
import {
  formatDate,
  getInfluencerUserId,
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

  const influencer = influencerQuery.data;
  const user =
    typeof influencer?.user === "object" ? influencer.user : undefined;

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
            Profile details and referral analytics.
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
                  value={String(analyticsQuery.data.total_codes)}
                />
                <MetricCard
                  label="Total redemptions"
                  value={String(analyticsQuery.data.total_redemptions)}
                />
                <MetricCard
                  label="Total discount given"
                  value={`$${analyticsQuery.data.total_discount_given}`}
                />
                <MetricCard
                  label="Total subscription revenue"
                  value={`$${analyticsQuery.data.total_subscription_revenue}`}
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
            <h2 className="text-sm font-semibold">Referral Codes</h2>
            {influencer.referral_codes?.length ? (
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Redemptions</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {influencer.referral_codes.map((code) => (
                      <TableRow
                        key={code.id}
                        className="cursor-pointer"
                        onClick={() =>
                          navigate(
                            `/influencer-referrals/referral-codes/${code.id}`
                          )
                        }
                      >
                        <TableCell className="font-medium">
                          {code.code}
                        </TableCell>
                        <TableCell>{code.discount_percentage}%</TableCell>
                        <TableCell>
                          {code.current_redemptions ?? 0}/{code.max_redemptions}
                        </TableCell>
                        <TableCell>
                          <StatusPill active={code.is_active} />
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
