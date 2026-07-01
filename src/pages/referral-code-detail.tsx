import { useMemo } from "react";

import { ArrowLeft, ArrowUpRight, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import {
  DetailItem,
  EmptyState,
  Field,
  LoadingState,
  StatusPill,
  toastMessage,
  ValidPill,
} from "@/components/influencer-referrals/shared";
import {
  formatDate,
  getApiError,
  getInfluencerName,
  isReferralValid,
  toIsoDate,
} from "@/components/influencer-referrals/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAdminAccessToken } from "@/lib/admin-auth";
import {
  useCreateReferralCommissionPaymentMutation,
  useGetReferralCodePerformanceQuery,
  useGetReferralCodeQuery,
  useGetReferralCommissionPaymentsQuery,
  useGetReferralCommissionRuleQuery,
  useUpdateReferralCommissionRuleMutation,
} from "@/store/services/referrals";

const emptyRuleForm: ReferralCommissionRulePayload = {
  commission_rate: "",
  eligible_billing_cycles: 1,
  revenue_basis: "net",
  is_active: true,
};

const emptyPaymentForm: ReferralCommissionPaymentPayload = {
  amount: "",
  currency: "",
  paid_at: "",
  notes: "",
};

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
  const ruleQuery = useGetReferralCommissionRuleQuery(
    { id: referralCodeId, token: accessToken },
    {
      skip: !accessToken || !referralCodeId,
      refetchOnMountOrArgChange: true,
    }
  );
  const paymentsQuery = useGetReferralCommissionPaymentsQuery(
    { id: referralCodeId, token: accessToken },
    {
      skip: !accessToken || !referralCodeId,
      refetchOnMountOrArgChange: true,
    }
  );

  const referral = referralQuery.data;
  const performance = performanceQuery.data;
  const commissions = performance?.commissions_due;
  const rule = ruleQuery.data ?? commissions?.rule;
  const payments = paymentsQuery.data?.results ?? [];
  const performanceLoading =
    performanceQuery.isLoading || performanceQuery.isFetching;
  const influencerId =
    performance?.influencer_id ??
    referral?.influencer_id ??
    (typeof referral?.influencer === "number" ? referral.influencer : undefined);

  const cohortEntries = useMemo(
    () =>
      Object.entries(performance?.cohorts ?? {}).sort(
        ([left], [right]) => getCohortIndex(left) - getCohortIndex(right)
      ),
    [performance?.cohorts]
  );

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
            Referral code details, commissions, and retention cohorts.
          </p>
        </div>
        {influencerId ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={() =>
              navigate(`/influencer-referrals/influencers/${influencerId}`)
            }
          >
            Influencer
            <ArrowUpRight />
          </Button>
        ) : null}
      </div>

      {referralQuery.isLoading || referralQuery.isFetching ? (
        <LoadingState />
      ) : referral ? (
        <div className="grid gap-5">
          <section className="grid gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold">Referral Summary</h2>
              <div className="flex flex-wrap gap-2">
                <StatusPill active={referral.is_active} />
                <ValidPill valid={isReferralValid(referral)} />
              </div>
            </div>
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
          </section>

          <section className="grid gap-3">
            <h2 className="text-sm font-semibold">Performance</h2>
            {performanceLoading ? (
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

          <section className="grid gap-3">
            <h2 className="text-sm font-semibold">Commissions Due</h2>
            {performanceLoading ? (
              <LoadingState />
            ) : commissions ? (
              <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-4">
                  <MetricCard
                    label="Total owed"
                    value={formatMoney(commissions.total, commissions.currency)}
                  />
                  <MetricCard
                    label="Paid"
                    value={formatMoney(commissions.paid, commissions.currency)}
                  />
                  <MetricCard
                    label="Unpaid"
                    value={formatMoney(
                      commissions.unpaid,
                      commissions.currency
                    )}
                  />
                  <MetricCard
                    label="Commissionable revenue"
                    value={formatMoney(
                      commissions.commissionable_revenue,
                      commissions.currency
                    )}
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-4">
                  <DetailItem
                    label="Rate"
                    value={`${commissions.rule.commission_rate}%`}
                  />
                  <DetailItem
                    label="Eligible billing cycles"
                    value={String(commissions.rule.eligible_billing_cycles)}
                  />
                  <DetailItem
                    label="Revenue basis"
                    value={formatRevenueBasis(commissions.rule.revenue_basis)}
                  />
                  <DetailItem
                    label="Rule status"
                    value={
                      commissions.rule.is_active
                        ? commissions.rule.configured === false
                          ? "Active, not configured"
                          : "Active"
                        : "Inactive"
                    }
                  />
                </div>
              </div>
            ) : (
              <EmptyState message="No commission metrics found." />
            )}
          </section>

          <section className="grid gap-3">
            <h2 className="text-sm font-semibold">Cohorts</h2>
            {performanceLoading ? (
              <LoadingState />
            ) : cohortEntries.length ? (
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cycle</TableHead>
                      <TableHead>Active subscribers</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cohortEntries.map(([cycle, activeSubscribers]) => (
                      <TableRow key={cycle}>
                        <TableCell className="font-medium">{cycle}</TableCell>
                        <TableCell>{activeSubscribers}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <EmptyState message="No cohort metrics found." />
            )}
          </section>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
            <CommissionRuleEditor
              token={accessToken}
              referralCodeId={referralCodeId}
              rule={rule}
              loading={ruleQuery.isLoading || ruleQuery.isFetching}
            />

            <CommissionPaymentsPanel
              token={accessToken}
              referralCodeId={referralCodeId}
              payments={payments}
              loading={paymentsQuery.isLoading || paymentsQuery.isFetching}
              defaultCurrency={commissions?.currency}
            />
          </div>

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

const CommissionRuleEditor = ({
  token,
  referralCodeId,
  rule,
  loading,
}: {
  token: string;
  referralCodeId: number;
  rule?: ReferralCommissionRule;
  loading: boolean;
}) => {
  const [form, setForm] =
    useState<ReferralCommissionRulePayload>(emptyRuleForm);
  const [updateRule, { isLoading: saving }] =
    useUpdateReferralCommissionRuleMutation();

  useEffect(() => {
    if (rule) {
      setForm({
        commission_rate: rule.commission_rate,
        eligible_billing_cycles: rule.eligible_billing_cycles,
        revenue_basis: rule.revenue_basis,
        is_active: rule.is_active,
      });
    }
  }, [rule]);

  const setField = (
    field: keyof ReferralCommissionRulePayload,
    value: string | number | boolean
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async () => {
    const rate = Number(form.commission_rate);
    const cycles = Number(form.eligible_billing_cycles);

    if (!form.commission_rate.trim() || Number.isNaN(rate) || rate < 0) {
      toastMessage("error", "Error", "Enter a valid commission rate.");
      return;
    }

    if (!Number.isInteger(cycles) || cycles < 1) {
      toastMessage(
        "error",
        "Error",
        "Eligible billing cycles must be a positive integer."
      );
      return;
    }

    if (!["gross", "net"].includes(form.revenue_basis)) {
      toastMessage("error", "Error", "Choose a valid revenue basis.");
      return;
    }

    try {
      await updateRule({
        id: referralCodeId,
        token,
        data: {
          ...form,
          commission_rate: form.commission_rate.trim(),
          eligible_billing_cycles: cycles,
        },
      }).unwrap();
      toastMessage("success", "Success", "Commission rule updated.");
    } catch (error) {
      toastMessage("error", "Error", getApiError(error));
    }
  };

  return (
    <section className="grid gap-3">
      <h2 className="text-sm font-semibold">Commission Rule</h2>
      {loading ? (
        <LoadingState />
      ) : (
        <div className="grid gap-4 rounded-md border p-4 md:grid-cols-2">
          <Field label="Rate">
            <Input
              type="number"
              min={0}
              step="0.01"
              value={form.commission_rate}
              onChange={(event) =>
                setField("commission_rate", event.target.value)
              }
            />
          </Field>
          <Field label="Eligible billing cycles">
            <Input
              type="number"
              min={1}
              step={1}
              value={form.eligible_billing_cycles}
              onChange={(event) =>
                setField(
                  "eligible_billing_cycles",
                  Number(event.target.value)
                )
              }
            />
          </Field>
          <Field label="Revenue basis">
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              value={form.revenue_basis}
              onChange={(event) =>
                setField(
                  "revenue_basis",
                  event.target.value as ReferralRevenueBasis
                )
              }
            >
              <option value="net">Net</option>
              <option value="gross">Gross</option>
            </select>
          </Field>
          <Field label="Active">
            <div className="flex h-9 items-center">
              <Switch
                checked={form.is_active}
                onCheckedChange={(checked) => setField("is_active", checked)}
              />
            </div>
          </Field>
          <div className="flex justify-end md:col-span-2">
            <Button
              type="button"
              disabled={saving || !token}
              onClick={submit}
            >
              {saving ? <Loader2 className="animate-spin" /> : "Save Rule"}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

const CommissionPaymentsPanel = ({
  token,
  referralCodeId,
  payments,
  loading,
  defaultCurrency,
}: {
  token: string;
  referralCodeId: number;
  payments: ReferralCommissionPayment[];
  loading: boolean;
  defaultCurrency?: string;
}) => {
  const [form, setForm] = useState<ReferralCommissionPaymentPayload>({
    ...emptyPaymentForm,
    paid_at: getLocalDateTimeInputValue(),
  });
  const [createPayment, { isLoading: saving }] =
    useCreateReferralCommissionPaymentMutation();

  useEffect(() => {
    if (defaultCurrency) {
      setForm((current) => ({
        ...current,
        currency: current.currency || defaultCurrency,
      }));
    }
  }, [defaultCurrency]);

  const setField = (
    field: keyof ReferralCommissionPaymentPayload,
    value: string
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async () => {
    const amount = Number(form.amount);

    if (!form.amount.trim() || Number.isNaN(amount) || amount <= 0) {
      toastMessage("error", "Error", "Enter a positive payment amount.");
      return;
    }

    if (!form.currency.trim()) {
      toastMessage("error", "Error", "Enter a payment currency.");
      return;
    }

    if (!form.paid_at) {
      toastMessage("error", "Error", "Choose a payment date.");
      return;
    }

    try {
      await createPayment({
        id: referralCodeId,
        token,
        data: {
          amount: form.amount.trim(),
          currency: form.currency.trim().toUpperCase(),
          paid_at: toIsoDate(form.paid_at),
          notes: form.notes?.trim() ?? "",
        },
      }).unwrap();
      toastMessage("success", "Success", "Commission payment recorded.");
      setForm({
        ...emptyPaymentForm,
        currency: defaultCurrency ?? form.currency.trim().toUpperCase(),
        paid_at: getLocalDateTimeInputValue(),
      });
    } catch (error) {
      toastMessage("error", "Error", getApiError(error));
    }
  };

  return (
    <section className="grid gap-3">
      <h2 className="text-sm font-semibold">Commission Payments</h2>
      <div className="grid gap-4 rounded-md border p-4 md:grid-cols-2">
        <Field label="Amount">
          <Input
            type="number"
            min={0}
            step="0.01"
            value={form.amount}
            onChange={(event) => setField("amount", event.target.value)}
          />
        </Field>
        <Field label="Currency">
          <Input
            value={form.currency}
            onChange={(event) =>
              setField("currency", event.target.value.toUpperCase())
            }
          />
        </Field>
        <Field label="Paid at">
          <Input
            type="datetime-local"
            value={form.paid_at}
            onChange={(event) => setField("paid_at", event.target.value)}
          />
        </Field>
        <Field label="Notes">
          <Input
            value={form.notes ?? ""}
            onChange={(event) => setField("notes", event.target.value)}
          />
        </Field>
        <div className="flex justify-end md:col-span-2">
          <Button type="button" disabled={saving || !token} onClick={submit}>
            {saving ? <Loader2 className="animate-spin" /> : "Record Payment"}
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingState />
      ) : payments.length ? (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Amount</TableHead>
                <TableHead>Paid at</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    {formatMoney(payment.amount, payment.currency)}
                  </TableCell>
                  <TableCell>{formatDate(payment.paid_at)}</TableCell>
                  <TableCell>{payment.notes || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState message="No commission payments recorded." />
      )}
    </section>
  );
};

const formatMoney = (value: string, currency: string) => {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return `${value} ${currency}`;
  }

  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${value} ${currency}`;
  }
};

const formatRevenueBasis = (basis: ReferralRevenueBasis) =>
  basis === "gross" ? "Gross" : "Net";

const getCohortIndex = (cycle: string) => {
  const parsed = Number(cycle.replace(/^M/i, ""));

  return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
};

const getLocalDateTimeInputValue = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);

  return local.toISOString().slice(0, 16);
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
