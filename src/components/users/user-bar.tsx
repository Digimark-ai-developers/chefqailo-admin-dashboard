import { type Dispatch, type SetStateAction } from "react";

import { Loader2 } from "lucide-react";

import { useAdminAccessToken } from "@/hooks/use-admin-access-token";
import { cn, truncateString } from "@/lib/utils";
import { useGetUserQuery } from "@/store/services/user";

import { Sheet, SheetContent } from "../ui/sheet";

interface SheetTriggerProps {
  id: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const formatDate = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatNumber = (value?: string | number | null) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return `${value}`;
  }

  return numberValue.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
};

const formatCurrency = (
  amount?: string | number | null,
  currency?: string | null
) => {
  if (amount === null || amount === undefined || amount === "") {
    return "-";
  }

  const numberValue = Number(amount);

  if (Number.isNaN(numberValue)) {
    return `${amount}`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(numberValue);
};

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <div className="flex items-start justify-between gap-3 border-b py-2 last:border-b-0">
    <span className="text-xs font-medium text-muted-foreground">{label}</span>
    <span className="max-w-[60%] break-words text-right text-xs font-medium">
      {value || "-"}
    </span>
  </div>
);

const UserBar = ({ id, open, setOpen }: SheetTriggerProps) => {
  const accessToken = useAdminAccessToken();

  const { data, isFetching, isLoading } = useGetUserQuery(
    { id: `${id}`, token: `${accessToken}` },
    {
      skip: !open || !accessToken || accessToken === "",
      refetchOnMountOrArgChange: true,
    }
  );

  const user = data?.user;
  const qailos = data?.qailos;
  const currentPackage = data?.current_package;
  const subscriptions = data?.subscriptions ?? [];
  const fullName = user
    ? `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
      user.username ||
      "User"
    : "User";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full overflow-hidden p-0 sm:max-w-xl">
        <div className="flex h-full w-full flex-col">
          <div className="flex w-full items-center justify-center gap-3 border-b p-5 pr-10">
            {isLoading || isFetching ? (
              <div className="flex min-h-16 flex-1 items-center justify-center">
                <Loader2 className="size-6 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <img
                  src={user?.image || "https://ui.shadcn.com/avatars/04.png"}
                  alt="user-picture"
                  className="aspect-square size-16 rounded-full bg-primary object-cover"
                />
                <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-1">
                  <span className="w-full truncate text-left text-lg font-bold leading-[20px]">
                    {truncateString(fullName, 24)}
                  </span>
                  <span className="w-full overflow-hidden truncate text-left text-xs text-gray-400">
                    {user?.email || "-"}
                  </span>
                  <span className="w-full overflow-hidden truncate text-left text-xs capitalize text-gray-400">
                    {user?.is_active ? "Active" : "Inactive"} |&nbsp;
                    {user?.payment_status || "-"} |&nbsp;
                    {user?.is_paid ? "Paid" : "Unpaid"}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="flex min-h-0 w-full flex-1 flex-col gap-5 overflow-y-auto p-5">
            <section className="grid grid-cols-2 gap-2">
              {[
                ["Purchased", qailos?.purchased],
                ["Used", qailos?.used],
                ["Remaining", qailos?.remaining],
                ["Reserved", qailos?.reserved],
                ["Available", qailos?.available],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-md border bg-muted/30 p-3 last:col-span-2"
                >
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <div className="mt-1 text-base font-semibold">
                    {formatNumber(value)}
                  </div>
                </div>
              ))}
            </section>

            <section className="rounded-md border">
              <div className="border-b px-3 py-2 text-sm font-semibold">
                User Details
              </div>
              <div className="px-3">
                <DetailRow label="User ID" value={user?.id} />
                <DetailRow label="Username" value={user?.username} />
                <DetailRow
                  label="Created"
                  value={formatDate(user?.createdAt)}
                />
                <DetailRow
                  label="Payment Status"
                  value={user?.payment_status}
                />
                <DetailRow label="Paid" value={user?.is_paid ? "Yes" : "No"} />
              </div>
            </section>

            <section className="rounded-md border">
              <div className="border-b px-3 py-2 text-sm font-semibold">
                Current Package
              </div>
              {currentPackage ? (
                <div className="px-3">
                  <DetailRow
                    label="Package"
                    value={currentPackage.package_name}
                  />
                  <DetailRow
                    label="Identifier"
                    value={currentPackage.package_identifier}
                  />
                  <DetailRow
                    label="Expires"
                    value={formatDate(currentPackage.expires_at)}
                  />
                  <DetailRow
                    label="Qailos Added"
                    value={formatNumber(currentPackage.qailos_added)}
                  />
                  <DetailRow
                    label="Qailos Used"
                    value={formatNumber(currentPackage.qailos_used)}
                  />
                  <DetailRow
                    label="Amount"
                    value={formatCurrency(
                      currentPackage.amount,
                      currentPackage.currency
                    )}
                  />
                  <DetailRow
                    label="Payment Method"
                    value={currentPackage.payment_method}
                  />
                  <DetailRow
                    label="Transaction"
                    value={currentPackage.transaction_id}
                  />
                  <DetailRow
                    label="Promo Code"
                    value={currentPackage.promo_code}
                  />
                  <DetailRow
                    label="Influencer"
                    value={currentPackage.influencer_name}
                  />
                </div>
              ) : (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No current package found.
                </div>
              )}
            </section>

            <section className="rounded-md border">
              <div className="border-b px-3 py-2 text-sm font-semibold">
                Subscriptions
              </div>
              {subscriptions.length > 0 ? (
                <div className="overflow-x-auto">
                  <div className="grid min-w-[460px] grid-cols-4 border-b bg-muted px-3 py-2 text-xs font-semibold">
                    <span>Package</span>
                    <span>Status</span>
                    <span>Amount</span>
                    <span>Expires</span>
                  </div>
                  {subscriptions.map((subscription, index) => (
                    <div
                      key={subscription.id}
                      className={cn(
                        "grid min-w-[460px] grid-cols-4 px-3 py-2 text-xs",
                        {
                          "bg-muted/40": index % 2 !== 0,
                        }
                      )}
                    >
                      <span className="truncate">
                        {subscription.package_name || "-"}
                      </span>
                      <span className="truncate capitalize">
                        {subscription.status || "-"}
                      </span>
                      <span>
                        {formatCurrency(
                          subscription.amount,
                          subscription.currency
                        )}
                      </span>
                      <span>{formatDate(subscription.expires_at)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No subscriptions found.
                </div>
              )}
            </section>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserBar;
