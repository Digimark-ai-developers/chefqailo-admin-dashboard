import { useEffect, useMemo, useState } from "react";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  useCreateInfluencerMutation,
  useCreateInfluencerOnboardingMutation,
  useCreateReferralCodeMutation,
  useGetInfluencerAnalyticsQuery,
  useGetInfluencerQuery,
  useGetReferralCodeQuery,
  useUpdateInfluencerMutation,
  useUpdateReferralCodeMutation,
} from "@/store/services/referrals";

import {
  emptyCreateInfluencerForm,
  emptyOnboardingForm,
  emptyReferralForm,
} from "./constants";
import {
  DetailItem,
  EmptyState,
  Field,
  LoadingState,
  StatusPill,
  toastMessage,
} from "./shared";
import {
  formatDate,
  getApiError,
  getInfluencerUserId,
  toInputDate,
  toIsoDate,
} from "./utils";

const cleanUserPayload = (
  user: InfluencerUserPayload,
  reuseExistingUser: boolean
): InfluencerUserPayload => {
  if (reuseExistingUser) {
    return {
      email: user.email.trim(),
    };
  }

  return {
    email: user.email.trim(),
    username: user.username?.trim(),
    password: user.password,
    first_name: user.first_name?.trim(),
    last_name: user.last_name?.trim(),
    ...(user.phone_number?.trim()
      ? { phone_number: user.phone_number.trim() }
      : {}),
    ...(user.country?.trim() ? { country: user.country.trim() } : {}),
    ...(user.state?.trim() ? { state: user.state.trim() } : {}),
  };
};

export const CreateInfluencerDialog = ({
  open,
  token,
  setOpen,
}: {
  open: boolean;
  token: string;
  setOpen: (open: boolean) => void;
}) => {
  const [reuseExistingUser, setReuseExistingUser] = useState(true);
  const [form, setForm] =
    useState<InfluencerOnboardingPayload>(emptyOnboardingForm);
  const [createInfluencer, { isLoading }] =
    useCreateInfluencerOnboardingMutation();

  const requiredFields = useMemo(
    () => [
      form.user.email,
      ...(reuseExistingUser
        ? []
        : [
            form.user.username ?? "",
            form.user.password ?? "",
            form.user.first_name ?? "",
            form.user.last_name ?? "",
          ]),
      form.influencer.display_name,
      form.influencer.social_platform,
      form.influencer.social_handle,
      form.referral_code.code,
      form.referral_code.discount_percentage,
      String(form.referral_code.max_redemptions),
      form.referral_code.valid_from,
      form.referral_code.valid_until,
    ],
    [form, reuseExistingUser]
  );

  const setUserField = (field: keyof InfluencerUserPayload, value: string) => {
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
          user: cleanUserPayload(form.user, reuseExistingUser),
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

      const userReused = response.data?.user_reused ?? response.user_reused;

      toastMessage(
        "success",
        "Success",
        response.message ??
          (userReused
            ? "Existing user reused and influencer profile created."
            : "Influencer created.")
      );
      setOpen(false);
      setForm(emptyOnboardingForm);
      setReuseExistingUser(true);
    } catch (error) {
      toastMessage("error", "Error", getApiError(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Onboard Influencer With Referral Code</DialogTitle>
          <DialogDescription>
            Create or reuse a user account, then create the influencer profile
            and first referral code.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6">
          <section className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold">User Account</h3>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Switch
                  checked={reuseExistingUser}
                  onCheckedChange={setReuseExistingUser}
                />
                Reuse existing user
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Email">
                <Input
                  type="email"
                  value={form.user.email}
                  onChange={(event) =>
                    setUserField("email", event.target.value)
                  }
                />
              </Field>
              {!reuseExistingUser ? (
                <>
                  <Field label="Username">
                    <Input
                      value={form.user.username ?? ""}
                      onChange={(event) =>
                        setUserField("username", event.target.value)
                      }
                    />
                  </Field>
                  <Field label="Password">
                    <Input
                      type="password"
                      value={form.user.password ?? ""}
                      onChange={(event) =>
                        setUserField("password", event.target.value)
                      }
                    />
                  </Field>
                  <Field label="First name">
                    <Input
                      value={form.user.first_name ?? ""}
                      onChange={(event) =>
                        setUserField("first_name", event.target.value)
                      }
                    />
                  </Field>
                  <Field label="Last name">
                    <Input
                      value={form.user.last_name ?? ""}
                      onChange={(event) =>
                        setUserField("last_name", event.target.value)
                      }
                    />
                  </Field>
                  <Field label="Phone number">
                    <Input
                      value={form.user.phone_number ?? ""}
                      onChange={(event) =>
                        setUserField("phone_number", event.target.value)
                      }
                    />
                  </Field>
                  <Field label="Country">
                    <Input
                      value={form.user.country ?? ""}
                      onChange={(event) =>
                        setUserField("country", event.target.value)
                      }
                    />
                  </Field>
                  <Field label="State">
                    <Input
                      value={form.user.state ?? ""}
                      onChange={(event) =>
                        setUserField("state", event.target.value)
                      }
                    />
                  </Field>
                </>
              ) : null}
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
            <Button
              type="button"
              disabled={isLoading || !token}
              onClick={submit}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const CreateInfluencerProfileDialog = ({
  open,
  token,
  setOpen,
}: {
  open: boolean;
  token: string;
  setOpen: (open: boolean) => void;
}) => {
  const [form, setForm] = useState<CreateInfluencerPayload>(
    emptyCreateInfluencerForm
  );
  const [createInfluencer, { isLoading }] = useCreateInfluencerMutation();

  const setField = (
    field: keyof CreateInfluencerPayload,
    value: string | number | boolean
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async () => {
    if (
      !form.user_id ||
      !form.display_name.trim() ||
      !form.social_platform.trim() ||
      !form.social_handle.trim()
    ) {
      toastMessage("error", "Error", "Please complete all required fields.");
      return;
    }

    try {
      const response = await createInfluencer({
        token,
        data: {
          ...form,
          user_id: Number(form.user_id),
          display_name: form.display_name.trim(),
          social_platform: form.social_platform.trim(),
          social_handle: form.social_handle.trim(),
        },
      }).unwrap();

      toastMessage(
        "success",
        "Success",
        response.message ?? "Influencer profile created."
      );
      setOpen(false);
      setForm(emptyCreateInfluencerForm);
    } catch (error) {
      toastMessage("error", "Error", getApiError(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Attach Influencer Profile</DialogTitle>
          <DialogDescription>
            Attach influencer capability to an existing app user by user ID.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Field label="User ID">
            <Input
              type="number"
              min={1}
              value={form.user_id || ""}
              onChange={(event) =>
                setField("user_id", Number(event.target.value))
              }
            />
          </Field>
          <Field label="Display name">
            <Input
              value={form.display_name}
              onChange={(event) => setField("display_name", event.target.value)}
            />
          </Field>
          <Field label="Social platform">
            <Input
              value={form.social_platform}
              onChange={(event) =>
                setField("social_platform", event.target.value)
              }
            />
          </Field>
          <Field label="Social handle">
            <Input
              value={form.social_handle}
              onChange={(event) =>
                setField("social_handle", event.target.value)
              }
            />
          </Field>
          <Field label="Active">
            <Switch
              checked={form.is_active}
              onCheckedChange={(checked) => setField("is_active", checked)}
            />
          </Field>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isLoading || !token}
              onClick={submit}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const InfluencerEditDialog = ({
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
      const response = await updateInfluencer({
        id,
        data: form,
        token,
      }).unwrap();
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

export const InfluencerDetailDialog = ({
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
              <DetailItem
                label="Social platform"
                value={data.social_platform}
              />
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
              <DetailItem label="Role" value={user?.role ?? "-"} />
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

export const AnalyticsDialog = ({
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

export const ReferralCodeDialog = ({
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
                onChange={(event) =>
                  setField("valid_until", event.target.value)
                }
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
