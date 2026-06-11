import { useEffect, useState } from "react";

import { Plus, RefreshCcw } from "lucide-react";

import { pageSize } from "@/components/influencer-referrals/constants";
import {
  AnalyticsDialog,
  CreateInfluencerDialog,
  InfluencerDetailDialog,
  InfluencerEditDialog,
  ReferralCodeDialog,
} from "@/components/influencer-referrals/dialogs";
import { toastMessage } from "@/components/influencer-referrals/shared";
import {
  InfluencersTable,
  ReferralCodesTable,
} from "@/components/influencer-referrals/tables";
import { getApiError } from "@/components/influencer-referrals/utils";
import { ValidateCodeTool } from "@/components/influencer-referrals/validate-code-tool";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WarningModal from "@/components/warning-modal";
import { getAdminAccessToken } from "@/lib/admin-auth";
import {
  useDeactivateInfluencerMutation,
  useDeactivateReferralCodeMutation,
  useGetInfluencersQuery,
  useGetReferralCodesQuery,
} from "@/store/services/referrals";

type DeleteTarget =
  | { type: "influencer"; id: number; label: string }
  | { type: "referral"; id: number; label: string }
  | null;

const InfluencerReferrals = () => {
  const [accessToken, setAccessToken] = useState("");
  const [influencerPage, setInfluencerPage] = useState(1);
  const [referralPage, setReferralPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editInfluencerId, setEditInfluencerId] = useState<number | null>(null);
  const [detailInfluencerId, setDetailInfluencerId] = useState<number | null>(
    null
  );
  const [analyticsInfluencerId, setAnalyticsInfluencerId] = useState<
    number | null
  >(null);
  const [referralOpen, setReferralOpen] = useState(false);
  const [editReferralId, setEditReferralId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

  const influencersQuery = useGetInfluencersQuery(
    { page: influencerPage, pageSize, token: accessToken },
    {
      skip: !accessToken,
      refetchOnMountOrArgChange: true,
    }
  );
  const referralsQuery = useGetReferralCodesQuery(
    { page: referralPage, pageSize, token: accessToken },
    {
      skip: !accessToken,
      refetchOnMountOrArgChange: true,
    }
  );

  const [deactivateInfluencer, influencerDeleteState] =
    useDeactivateInfluencerMutation();
  const [deactivateReferralCode, referralDeleteState] =
    useDeactivateReferralCodeMutation();

  const handleToken = async () => {
    const token = getAdminAccessToken();

    if (token) {
      setAccessToken(token);
    }
  };

  const handleDeactivate = async () => {
    if (!deleteTarget || !accessToken) {
      return;
    }

    try {
      if (deleteTarget.type === "influencer") {
        await deactivateInfluencer({
          id: deleteTarget.id,
          token: accessToken,
        }).unwrap();
      } else {
        await deactivateReferralCode({
          id: deleteTarget.id,
          token: accessToken,
        }).unwrap();
      }

      toastMessage("success", "Success", `${deleteTarget.label} deactivated.`);
      setDeleteTarget(null);
    } catch (error) {
      toastMessage("error", "Error", getApiError(error));
    }
  };

  useEffect(() => {
    handleToken();
  }, []);

  return (
    <>
      <WarningModal
        open={!!deleteTarget}
        setOpen={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
        loading={
          influencerDeleteState.isLoading || referralDeleteState.isLoading
        }
        message={`deactivate ${deleteTarget?.label ?? "this item"}`}
        cta={handleDeactivate}
      />
      <CreateInfluencerDialog
        open={createOpen}
        token={accessToken}
        setOpen={setCreateOpen}
      />
      <InfluencerEditDialog
        id={editInfluencerId}
        token={accessToken}
        setId={setEditInfluencerId}
      />
      <InfluencerDetailDialog
        id={detailInfluencerId}
        token={accessToken}
        setId={setDetailInfluencerId}
      />
      <AnalyticsDialog
        id={analyticsInfluencerId}
        token={accessToken}
        setId={setAnalyticsInfluencerId}
      />
      <ReferralCodeDialog
        open={referralOpen || !!editReferralId}
        id={editReferralId}
        token={accessToken}
        influencers={influencersQuery.data?.results ?? []}
        setOpen={(open) => {
          setReferralOpen(open);

          if (!open) {
            setEditReferralId(null);
          }
        }}
      />
      <div className="flex h-full w-full flex-col gap-5 overflow-y-auto pr-1">
        <div className="flex w-full flex-wrap items-center gap-3">
          <span className="flex-1 text-left text-xl font-semibold">
            Influencer Referrals
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              influencersQuery.refetch();
              referralsQuery.refetch();
            }}
          >
            <RefreshCcw />
            Refresh
          </Button>
          <Button type="button" size="sm" onClick={() => setReferralOpen(true)}>
            <Plus />
            Add Referral Code
          </Button>
          <Button type="button" size="sm" onClick={() => setCreateOpen(true)}>
            <Plus />
            Create Influencer
          </Button>
        </div>
        <Tabs defaultValue="influencers" className="w-full">
          <TabsList>
            <TabsTrigger value="influencers">Influencers</TabsTrigger>
            <TabsTrigger value="codes">Referral Codes</TabsTrigger>
            <TabsTrigger value="validate">Validate Code</TabsTrigger>
          </TabsList>
          <TabsContent value="influencers" className="space-y-4">
            <InfluencersTable
              data={influencersQuery.data}
              loading={
                influencersQuery.isLoading || influencersQuery.isFetching
              }
              page={influencerPage}
              onPageChange={setInfluencerPage}
              onView={setDetailInfluencerId}
              onEdit={setEditInfluencerId}
              onAnalytics={setAnalyticsInfluencerId}
              onDeactivate={(id, name) =>
                setDeleteTarget({
                  type: "influencer",
                  id,
                  label: name,
                })
              }
            />
          </TabsContent>
          <TabsContent value="codes" className="space-y-4">
            <ReferralCodesTable
              data={referralsQuery.data}
              loading={referralsQuery.isLoading || referralsQuery.isFetching}
              page={referralPage}
              onPageChange={setReferralPage}
              onEdit={setEditReferralId}
              onDeactivate={(id, code) =>
                setDeleteTarget({
                  type: "referral",
                  id,
                  label: code,
                })
              }
            />
          </TabsContent>
          <TabsContent value="validate">
            <ValidateCodeTool />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default InfluencerReferrals;
