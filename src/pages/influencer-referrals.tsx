import { type ReactNode, useEffect, useMemo, useState } from "react";

import {
  BarChart3,
  Ban,
  Eye,
  Loader2,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
} from "lucide-react";
import { toast } from "sonner";

import WarningModal from "@/components/warning-modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CustomToast from "@/components/ui/custom-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAdminAccessToken } from "@/lib/admin-auth";
import { cn } from "@/lib/utils";
import {
  useCreateInfluencerOnboardingMutation,
  useCreateReferralCodeMutation,
  useDeactivateInfluencerMutation,
  useDeactivateReferralCodeMutation,
  useGetInfluencerAnalyticsQuery,
  useGetInfluencerQuery,
  useGetInfluencersQuery,
  useGetReferralCodeQuery,
  useGetReferralCodesQuery,
  useUpdateInfluencerMutation,
  useUpdateReferralCodeMutation,
  useValidateReferralCodeMutation,
} from "@/store/services/referrals";

type DeleteTarget =
  | { type: "influencer"; id: number; label: string }
  | { type: "referral"; id: number; label: string }
  | null;

const pageSize = 10;

const emptyOnboardingForm: InfluencerOnboardingPayload = {
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

const emptyReferralForm: ReferralCodePayload = {
  influencer_id: 0,
  code: "",
  discount_percentage: "",
  max_redemptions: 0,
  valid_from: "",
  valid_until: "",
  is_active: true,
};

const getApiError = (error: unknown) => {
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

const toastMessage = (
  type: "success" | "error" | "info",
  title: string,
  description: string
) => {
  toast.custom(() => (
    <CustomToast type={type} title={title} description={description} />
  ));
};

const formatDate = (value?: string) => {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const toInputDate = (value?: string) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 16);
};

const toIsoDate = (value: string) => {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString();
};

const getInfluencerUserId = (influencer: Influencer) => {
  if (typeof influencer.user === "number") {
    return influencer.user;
  }

  return influencer.user_id ?? influencer.user?.id ?? "-";
};

const getInfluencerName = (referral: ReferralCode) => {
  if (referral.influencer_name) {
    return referral.influencer_name;
  }

  if (typeof referral.influencer === "object") {
    return referral.influencer.display_name;
  }

  return referral.influencer_id ?? referral.influencer ?? "-";
};

const isReferralValid = (referral: ReferralCode) =>
  referral.is_valid ?? referral.valid ?? false;

const StatusPill = ({ active }: { active: boolean }) => (
  <span
    className={cn(
      "inline-flex min-w-16 items-center justify-center rounded-md px-2 py-1 text-xs font-medium",
      active
        ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300"
        : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
    )}
  >
    {active ? "Active" : "Inactive"}
  </span>
);

const ValidPill = ({ valid }: { valid: boolean }) => (
  <span
    className={cn(
      "inline-flex min-w-14 items-center justify-center rounded-md px-2 py-1 text-xs font-medium",
      valid
        ? "bg-primary/15 text-primary"
        : "bg-muted text-muted-foreground"
    )}
  >
    {valid ? "Valid" : "Invalid"}
  </span>
);

const Field = ({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) => (
  <div className={cn("grid gap-2", className)}>
    <Label>{label}</Label>
    {children}
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex h-40 w-full items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
    {message}
  </div>
);

const LoadingState = () => (
  <div className="flex h-40 w-full items-center justify-center">
    <Loader2 className="size-8 animate-spin text-primary" />
  </div>
);

const Pagination = ({
  page,
  total,
  onPageChange,
}: {
  page: number;
  total: number;
  onPageChange: (page: number) => void;
}) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="flex w-full items-center justify-end gap-3">
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
};

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
              loading={influencersQuery.isLoading || influencersQuery.isFetching}
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

const InfluencersTable = ({
  data,
  loading,
  page,
  onPageChange,
  onView,
  onEdit,
  onDeactivate,
  onAnalytics,
}: {
  data?: PaginatedResponse<Influencer>;
  loading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDeactivate: (id: number, name: string) => void;
  onAnalytics: (id: number) => void;
}) => {
  if (loading) {
    return <LoadingState />;
  }

  if (!data?.results.length) {
    return <EmptyState message="No influencers found." />;
  }

  return (
    <>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Display name</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Social platform</TableHead>
              <TableHead>Social handle</TableHead>
              <TableHead>Active status</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead className="w-64">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.results.map((influencer) => (
              <TableRow key={influencer.id}>
                <TableCell>{influencer.id}</TableCell>
                <TableCell className="font-medium">
                  {influencer.display_name}
                </TableCell>
                <TableCell>{getInfluencerUserId(influencer)}</TableCell>
                <TableCell className="capitalize">
                  {influencer.social_platform}
                </TableCell>
                <TableCell>{influencer.social_handle}</TableCell>
                <TableCell>
                  <StatusPill active={influencer.is_active} />
                </TableCell>
                <TableCell>{formatDate(influencer.created_at)}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onView(influencer.id)}
                    >
                      <Eye />
                      View
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(influencer.id)}
                    >
                      <Pencil />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onAnalytics(influencer.id)}
                    >
                      <BarChart3 />
                      Analytics
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        onDeactivate(influencer.id, influencer.display_name)
                      }
                    >
                      <Ban />
                      Deactivate
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination page={page} total={data.count} onPageChange={onPageChange} />
    </>
  );
};

const ReferralCodesTable = ({
  data,
  loading,
  page,
  onPageChange,
  onEdit,
  onDeactivate,
}: {
  data?: PaginatedResponse<ReferralCode>;
  loading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  onEdit: (id: number) => void;
  onDeactivate: (id: number, code: string) => void;
}) => {
  if (loading) {
    return <LoadingState />;
  }

  if (!data?.results.length) {
    return <EmptyState message="No referral codes found." />;
  }

  return (
    <>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Influencer name</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Redemptions</TableHead>
              <TableHead>Max</TableHead>
              <TableHead>Valid from</TableHead>
              <TableHead>Valid until</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Valid</TableHead>
              <TableHead>Invalid reason</TableHead>
              <TableHead className="w-44">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.results.map((referral) => (
              <TableRow key={referral.id}>
                <TableCell>{referral.id}</TableCell>
                <TableCell className="font-medium">{referral.code}</TableCell>
                <TableCell>{getInfluencerName(referral)}</TableCell>
                <TableCell>{referral.discount_percentage}%</TableCell>
                <TableCell>{referral.current_redemptions ?? 0}</TableCell>
                <TableCell>{referral.max_redemptions}</TableCell>
                <TableCell>{formatDate(referral.valid_from)}</TableCell>
                <TableCell>{formatDate(referral.valid_until)}</TableCell>
                <TableCell>
                  <StatusPill active={referral.is_active} />
                </TableCell>
                <TableCell>
                  <ValidPill valid={isReferralValid(referral)} />
                </TableCell>
                <TableCell className="max-w-56 whitespace-normal">
                  {referral.invalid_reason || "-"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(referral.id)}
                    >
                      <Pencil />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeactivate(referral.id, referral.code)}
                    >
                      <Ban />
                      Deactivate
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination page={page} total={data.count} onPageChange={onPageChange} />
    </>
  );
};

const CreateInfluencerDialog = ({
  open,
  token,
  setOpen,
}: {
  open: boolean;
  token: string;
  setOpen: (open: boolean) => void;
}) => {
  const [form, setForm] = useState<InfluencerOnboardingPayload>(
    emptyOnboardingForm
  );
  const [createInfluencer, { isLoading }] =
    useCreateInfluencerOnboardingMutation();

  const requiredFields = useMemo(
    () => [
      form.user.username,
      form.user.email,
      form.user.password,
      form.user.first_name,
      form.user.last_name,
      form.user.phone_number,
      form.user.country,
      form.user.state,
      form.influencer.display_name,
      form.influencer.social_platform,
      form.influencer.social_handle,
      form.referral_code.code,
      form.referral_code.discount_percentage,
      String(form.referral_code.max_redemptions),
      form.referral_code.valid_from,
      form.referral_code.valid_until,
    ],
    [form]
  );

  const setUserField = (
    field: keyof InfluencerUserPayload,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      user: { ...current.user, [field]: value },
    }));
  };

  const setInfluencerField = (
    field: keyof InfluencerProfilePayload,
    value: string | boolean
  ) => {
    setForm((current) => ({
      ...current,
      influencer: { ...current.influencer, [field]: value },
    }));
  };

  const setReferralField = (
    field: keyof InitialReferralCodePayload,
    value: string | number | boolean
  ) => {
    setForm((current) => ({
      ...current,
      referral_code: { ...current.referral_code, [field]: value },
    }));
  };

  const submit = async () => {
    if (requiredFields.some((field) => !field || field.trim() === "")) {
      toastMessage("error", "Error", "Please complete all required fields.");
      return;
    }

    try {
      const response = await createInfluencer({
        token,
        data: {
          ...form,
          referral_code: {
            ...form.referral_code,
            code: form.referral_code.code.trim().toUpperCase(),
            discount_percentage: form.referral_code.discount_percentage,
            max_redemptions: Number(form.referral_code.max_redemptions),
            valid_from: toIsoDate(form.referral_code.valid_from),
            valid_until: toIsoDate(form.referral_code.valid_until),
          },
        },
      }).unwrap();

      toastMessage(
        "success",
        "Success",
        response.message ?? "Influencer created."
      );
      setOpen(false);
      setForm(emptyOnboardingForm);
    } catch (error) {
      toastMessage("error", "Error", getApiError(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Influencer With Referral Code</DialogTitle>
          <DialogDescription>
            Create the user account, influencer profile, and first referral code.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6">
          <section className="grid gap-4">
            <h3 className="text-sm font-semibold">User Account</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Username">
                <Input
                  value={form.user.username}
                  onChange={(event) =>
                    setUserField("username", event.target.value)
                  }
                />
              </Field>
              <Field label="Email">
                <Input
                  type="email"
                  value={form.user.email}
                  onChange={(event) => setUserField("email", event.target.value)}
                />
              </Field>
              <Field label="Password">
                <Input
                  type="password"
                  value={form.user.password}
                  onChange={(event) =>
                    setUserField("password", event.target.value)
                  }
                />
              </Field>
              <Field label="Phone number">
                <Input
                  value={form.user.phone_number}
                  onChange={(event) =>
                    setUserField("phone_number", event.target.value)
                  }
                />
              </Field>
              <Field label="First name">
                <Input
                  value={form.user.first_name}
                  onChange={(event) =>
                    setUserField("first_name", event.target.value)
                  }
                />
              </Field>
              <Field label="Last name">
                <Input
                  value={form.user.last_name}
                  onChange={(event) =>
                    setUserField("last_name", event.target.value)
                  }
                />
              </Field>
              <Field label="Country">
                <Input
                  value={form.user.country}
                  onChange={(event) =>
                    setUserField("country", event.target.value)
                  }
                />
              </Field>
              <Field label="State">
                <Input
                  value={form.user.state}
                  onChange={(event) => setUserField("state", event.target.value)}
                />
              </Field>
            </div>
          </section>
          <section className="grid gap-4">
            <h3 className="text-sm font-semibold">Influencer Profile</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Display name">
                <Input
                  value={form.influencer.display_name}
                  onChange={(event) =>
                    setInfluencerField("display_name", event.target.value)
                  }
                />
              </Field>
              <Field label="Social platform">
                <Input
                  value={form.influencer.social_platform}
                  onChange={(event) =>
                    setInfluencerField("social_platform", event.target.value)
                  }
                />
              </Field>
              <Field label="Social handle">
                <Input
                  value={form.influencer.social_handle}
                  onChange={(event) =>
                    setInfluencerField("social_handle", event.target.value)
                  }
                />
              </Field>
              <Field label="Active" className="md:col-span-3">
                <Switch
                  checked={form.influencer.is_active}
                  onCheckedChange={(checked) =>
                    setInfluencerField("is_active", checked)
                  }
                />
              </Field>
            </div>
          </section>
          <section className="grid gap-4">
            <h3 className="text-sm font-semibold">Referral Code</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Code">
                <Input
                  value={form.referral_code.code}
                  onChange={(event) =>
                    setReferralField("code", event.target.value.toUpperCase())
                  }
                />
              </Field>
              <Field label="Discount percentage">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step="0.01"
                  value={form.referral_code.discount_percentage}
                  onChange={(event) =>
                    setReferralField("discount_percentage", event.target.value)
                  }
                />
              </Field>
              <Field label="Max redemptions">
                <Input
                  type="number"
                  min={0}
                  value={form.referral_code.max_redemptions}
                  onChange={(event) =>
                    setReferralField(
                      "max_redemptions",
                      Number(event.target.value)
                    )
                  }
                />
              </Field>
              <Field label="Valid from">
                <Input
                  type="datetime-local"
                  value={form.referral_code.valid_from}
                  onChange={(event) =>
                    setReferralField("valid_from", event.target.value)
                  }
                />
              </Field>
              <Field label="Valid until">
                <Input
                  type="datetime-local"
                  value={form.referral_code.valid_until}
                  onChange={(event) =>
                    setReferralField("valid_until", event.target.value)
                  }
                />
              </Field>
              <Field label="Active">
                <Switch
                  checked={form.referral_code.is_active}
                  onCheckedChange={(checked) =>
                    setReferralField("is_active", checked)
                  }
                />
              </Field>
            </div>
          </section>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" disabled={isLoading || !token} onClick={submit}>
              {isLoading ? <Loader2 className="animate-spin" /> : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const InfluencerEditDialog = ({
  id,
  token,
  setId,
}: {
  id: number | null;
  token: string;
  setId: (id: number | null) => void;
}) => {
  const open = !!id;
  const { data, isLoading } = useGetInfluencerQuery(
    { id: id ?? 0, token },
    { skip: !id || !token, refetchOnMountOrArgChange: true }
  );
  const [updateInfluencer, { isLoading: saving }] =
    useUpdateInfluencerMutation();
  const [form, setForm] = useState<InfluencerProfilePayload>({
    display_name: "",
    social_platform: "",
    social_handle: "",
    is_active: true,
  });

  useEffect(() => {
    if (data) {
      setForm({
        display_name: data.display_name,
        social_platform: data.social_platform,
        social_handle: data.social_handle,
        is_active: data.is_active,
      });
    }
  }, [data]);

  const submit = async () => {
    if (!id) {
      return;
    }

    if (
      !form.display_name.trim() ||
      !form.social_platform.trim() ||
      !form.social_handle.trim()
    ) {
      toastMessage("error", "Error", "Please complete all required fields.");
      return;
    }

    try {
      const response = await updateInfluencer({ id, data: form, token }).unwrap();
      toastMessage(
        "success",
        "Success",
        response.message ?? "Influencer updated."
      );
      setId(null);
    } catch (error) {
      toastMessage("error", "Error", getApiError(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && setId(null)}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Influencer Profile</DialogTitle>
          <DialogDescription>
            Update profile fields and active status.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <LoadingState />
        ) : (
          <div className="grid gap-4">
            <Field label="Display name">
              <Input
                value={form.display_name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    display_name: event.target.value,
                  }))
                }
              />
            </Field>
            <Field label="Social platform">
              <Input
                value={form.social_platform}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    social_platform: event.target.value,
                  }))
                }
              />
            </Field>
            <Field label="Social handle">
              <Input
                value={form.social_handle}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    social_handle: event.target.value,
                  }))
                }
              />
            </Field>
            <Field label="Active">
              <Switch
                checked={form.is_active}
                onCheckedChange={(checked) =>
                  setForm((current) => ({ ...current, is_active: checked }))
                }
              />
            </Field>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setId(null)}
              >
                Cancel
              </Button>
              <Button type="button" disabled={saving} onClick={submit}>
                {saving ? <Loader2 className="animate-spin" /> : "Save"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const InfluencerDetailDialog = ({
  id,
  token,
  setId,
}: {
  id: number | null;
  token: string;
  setId: (id: number | null) => void;
}) => {
  const { data, isLoading } = useGetInfluencerQuery(
    { id: id ?? 0, token },
    { skip: !id || !token, refetchOnMountOrArgChange: true }
  );
  const user = typeof data?.user === "object" ? data.user : undefined;

  return (
    <Dialog open={!!id} onOpenChange={(open) => !open && setId(null)}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Influencer Detail</DialogTitle>
          <DialogDescription>
            Profile, user, and referral summary.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <LoadingState />
        ) : data ? (
          <div className="grid gap-5">
            <div className="grid gap-3 md:grid-cols-2">
              <DetailItem label="Display name" value={data.display_name} />
              <DetailItem
                label="User ID"
                value={String(getInfluencerUserId(data))}
              />
              <DetailItem label="Social platform" value={data.social_platform} />
              <DetailItem label="Social handle" value={data.social_handle} />
              <DetailItem
                label="Active"
                value={data.is_active ? "Active" : "Inactive"}
              />
              <DetailItem
                label="Created at"
                value={formatDate(data.created_at)}
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
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
              <DetailItem label="Country" value={user?.country ?? "-"} />
              <DetailItem label="State" value={user?.state ?? "-"} />
            </div>
            <div className="grid gap-2">
              <h3 className="text-sm font-semibold">Referral Codes</h3>
              {data.referral_codes?.length ? (
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
                      {data.referral_codes.map((code) => (
                        <TableRow key={code.id}>
                          <TableCell>{code.code}</TableCell>
                          <TableCell>{code.discount_percentage}%</TableCell>
                          <TableCell>
                            {code.current_redemptions ?? 0}/
                            {code.max_redemptions}
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
            </div>
          </div>
        ) : (
          <EmptyState message="Influencer detail was not found." />
        )}
      </DialogContent>
    </Dialog>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-md border p-3">
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className="mt-1 break-words text-sm font-medium">{value}</div>
  </div>
);

const AnalyticsDialog = ({
  id,
  token,
  setId,
}: {
  id: number | null;
  token: string;
  setId: (id: number | null) => void;
}) => {
  const { data, isLoading } = useGetInfluencerAnalyticsQuery(
    { id: id ?? 0, token },
    { skip: !id || !token, refetchOnMountOrArgChange: true }
  );

  return (
    <Dialog open={!!id} onOpenChange={(open) => !open && setId(null)}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Influencer Analytics</DialogTitle>
          <DialogDescription>Referral performance totals.</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <LoadingState />
        ) : data ? (
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard label="Total codes" value={String(data.total_codes)} />
            <MetricCard
              label="Total redemptions"
              value={String(data.total_redemptions)}
            />
            <MetricCard
              label="Total discount given"
              value={`$${data.total_discount_given}`}
            />
            <MetricCard
              label="Total subscription revenue"
              value={`$${data.total_subscription_revenue}`}
            />
          </div>
        ) : (
          <EmptyState message="No analytics found." />
        )}
      </DialogContent>
    </Dialog>
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

const ReferralCodeDialog = ({
  open,
  id,
  token,
  influencers,
  setOpen,
}: {
  open: boolean;
  id: number | null;
  token: string;
  influencers: Influencer[];
  setOpen: (open: boolean) => void;
}) => {
  const { data, isLoading } = useGetReferralCodeQuery(
    { id: id ?? 0, token },
    { skip: !id || !token, refetchOnMountOrArgChange: true }
  );
  const [createReferralCode, createState] = useCreateReferralCodeMutation();
  const [updateReferralCode, updateState] = useUpdateReferralCodeMutation();
  const [form, setForm] = useState<ReferralCodePayload>(emptyReferralForm);

  useEffect(() => {
    if (id && data) {
      setForm({
        influencer_id:
          data.influencer_id ??
          (typeof data.influencer === "number" ? data.influencer : 0),
        code: data.code,
        discount_percentage: data.discount_percentage,
        max_redemptions: data.max_redemptions,
        valid_from: toInputDate(data.valid_from),
        valid_until: toInputDate(data.valid_until),
        is_active: data.is_active,
      });
    }

    if (!id && open) {
      setForm(emptyReferralForm);
    }
  }, [data, id, open]);

  const setField = (
    field: keyof ReferralCodePayload,
    value: string | number | boolean
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async () => {
    if (
      !form.influencer_id ||
      !form.code.trim() ||
      !form.discount_percentage.trim() ||
      !form.valid_from ||
      !form.valid_until
    ) {
      toastMessage("error", "Error", "Please complete all required fields.");
      return;
    }

    const payload: ReferralCodePayload = {
      ...form,
      influencer_id: Number(form.influencer_id),
      code: form.code.trim().toUpperCase(),
      max_redemptions: Number(form.max_redemptions),
      valid_from: toIsoDate(form.valid_from),
      valid_until: toIsoDate(form.valid_until),
    };

    try {
      const response =
        id !== null
          ? await updateReferralCode({ id, data: payload, token }).unwrap()
          : await createReferralCode({ data: payload, token }).unwrap();

      toastMessage(
        "success",
        "Success",
        response.message ?? `Referral code ${id ? "updated" : "created"}.`
      );
      setOpen(false);
    } catch (error) {
      toastMessage("error", "Error", getApiError(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{id ? "Edit" : "Add"} Referral Code</DialogTitle>
          <DialogDescription>
            Manage referral code details for an influencer.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <LoadingState />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Influencer ID">
              <Input
                list="influencer-options"
                type="number"
                min={1}
                value={form.influencer_id || ""}
                onChange={(event) =>
                  setField("influencer_id", Number(event.target.value))
                }
              />
              <datalist id="influencer-options">
                {influencers.map((influencer) => (
                  <option key={influencer.id} value={influencer.id}>
                    {influencer.display_name}
                  </option>
                ))}
              </datalist>
            </Field>
            <Field label="Code">
              <Input
                value={form.code}
                onChange={(event) =>
                  setField("code", event.target.value.toUpperCase())
                }
              />
            </Field>
            <Field label="Discount percentage">
              <Input
                type="number"
                min={0}
                max={100}
                step="0.01"
                value={form.discount_percentage}
                onChange={(event) =>
                  setField("discount_percentage", event.target.value)
                }
              />
            </Field>
            <Field label="Max redemptions">
              <Input
                type="number"
                min={0}
                value={form.max_redemptions}
                onChange={(event) =>
                  setField("max_redemptions", Number(event.target.value))
                }
              />
            </Field>
            <Field label="Valid from">
              <Input
                type="datetime-local"
                value={form.valid_from}
                onChange={(event) => setField("valid_from", event.target.value)}
              />
            </Field>
            <Field label="Valid until">
              <Input
                type="datetime-local"
                value={form.valid_until}
                onChange={(event) => setField("valid_until", event.target.value)}
              />
            </Field>
            <Field label="Active">
              <Switch
                checked={form.is_active}
                onCheckedChange={(checked) => setField("is_active", checked)}
              />
            </Field>
            <div className="flex items-end justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={createState.isLoading || updateState.isLoading}
                onClick={submit}
              >
                {createState.isLoading || updateState.isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const ValidateCodeTool = () => {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<ReferralValidationResponse | null>(null);
  const [validateReferralCode, { isLoading }] =
    useValidateReferralCodeMutation();

  const submit = async () => {
    if (!code.trim()) {
      toastMessage("error", "Error", "Enter a referral code to validate.");
      return;
    }

    try {
      const response = await validateReferralCode({
        code: code.trim().toUpperCase(),
      }).unwrap();

      setResult(response);
      toastMessage(
        response.valid ? "success" : "error",
        "Validation",
        response.message
      );
    } catch (error) {
      setResult(null);
      toastMessage("error", "Error", getApiError(error));
    }
  };

  return (
    <div className="grid max-w-xl gap-4 rounded-md border p-4">
      <Field label="Referral code">
        <Input
          value={code}
          onChange={(event) => setCode(event.target.value.toUpperCase())}
        />
      </Field>
      <div className="flex justify-end">
        <Button type="button" disabled={isLoading} onClick={submit}>
          {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
          Validate
        </Button>
      </div>
      {result ? (
        <div
          className={cn(
            "rounded-md border p-3 text-sm",
            result.valid
              ? "border-green-200 bg-green-50 text-green-700 dark:bg-green-500/10"
              : "border-red-200 bg-red-50 text-red-700 dark:bg-red-500/10"
          )}
        >
          <div className="font-medium">{result.message}</div>
          {result.valid ? (
            <div className="mt-2 text-muted-foreground">
              {result.discount_percentage}% discount from{" "}
              {result.influencer_name}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default InfluencerReferrals;
