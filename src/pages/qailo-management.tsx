import { useEffect, useState } from "react";

import { Eye, Loader2, RefreshCcw, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAdminAccessToken } from "@/lib/admin-auth";
import { cn } from "@/lib/utils";
import {
  type QailosCoefficient,
  useGetQailosCoefficientsQuery,
  usePatchQailosCoefficientMutation,
} from "@/store/services/qailos";

type RateSource = "qailos_per_token" | "eur_per_token";

const pageSize = 10;

const rateSourceLabels: Record<RateSource, string> = {
  qailos_per_token: "Qailos/token",
  eur_per_token: "EUR/token",
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

const Field = ({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
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

const RateSourceControl = ({
  value,
  onChange,
}: {
  value: RateSource;
  onChange: (value: RateSource) => void;
}) => (
  <div className="grid grid-cols-2 gap-2">
    {(Object.keys(rateSourceLabels) as RateSource[]).map((source) => (
      <Button
        key={source}
        type="button"
        variant={value === source ? "default" : "outline"}
        onClick={() => onChange(source)}
      >
        {rateSourceLabels[source]}
      </Button>
    ))}
  </div>
);

const QailoManagement = () => {
  const [accessToken, setAccessToken] = useState("");
  const [page, setPage] = useState(1);
  const [viewTarget, setViewTarget] = useState<QailosCoefficient | null>(null);
  const [rateTarget, setRateTarget] = useState<QailosCoefficient | null>(null);

  const coefficientsQuery = useGetQailosCoefficientsQuery(
    { page, pageSize, token: accessToken },
    {
      skip: !accessToken,
      refetchOnMountOrArgChange: true,
    }
  );

  const handleToken = async () => {
    const token = getAdminAccessToken();

    if (token) {
      setAccessToken(token);
    }
  };

  useEffect(() => {
    handleToken();
  }, []);

  return (
    <>
      <CoefficientDetailDialog
        coefficient={viewTarget}
        setCoefficient={setViewTarget}
      />
      <RatePatchDialog
        coefficient={rateTarget}
        token={accessToken}
        setCoefficient={setRateTarget}
      />
      <div className="flex h-full w-full flex-col gap-5 overflow-y-auto pr-1">
        <div className="flex w-full flex-wrap items-center gap-3">
          <span className="flex-1 text-left text-xl font-semibold">
            Qailo Management
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => coefficientsQuery.refetch()}
          >
            <RefreshCcw />
            Refresh
          </Button>
        </div>
        <CoefficientsTable
          data={coefficientsQuery.data}
          loading={coefficientsQuery.isLoading || coefficientsQuery.isFetching}
          page={page}
          onPageChange={setPage}
          onView={setViewTarget}
          onPatch={setRateTarget}
        />
      </div>
    </>
  );
};

const CoefficientsTable = ({
  data,
  loading,
  page,
  onPageChange,
  onView,
  onPatch,
}: {
  data?: PaginatedResponse<QailosCoefficient>;
  loading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  onView: (coefficient: QailosCoefficient) => void;
  onPatch: (coefficient: QailosCoefficient) => void;
}) => {
  if (loading) {
    return <LoadingState />;
  }

  if (!data?.results.length) {
    return <EmptyState message="No Qailos coefficients found." />;
  }

  return (
    <>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Component</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Qailos/token</TableHead>
              <TableHead>EUR/token</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-64">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.results.map((coefficient) => {
              const canManage = coefficient.id !== undefined;

              return (
                <TableRow key={coefficient.id ?? coefficient.code}>
                  <TableCell>{coefficient.id ?? "-"}</TableCell>
                  <TableCell className="font-medium">
                    {coefficient.code}
                  </TableCell>
                  <TableCell>{coefficient.provider}</TableCell>
                  <TableCell>{coefficient.model ?? "-"}</TableCell>
                  <TableCell className="capitalize">
                    {coefficient.component}
                  </TableCell>
                  <TableCell className="capitalize">
                    {coefficient.unit_type ?? "-"}
                  </TableCell>
                  <TableCell>{coefficient.qailos_per_token}</TableCell>
                  <TableCell>{coefficient.eur_per_token}</TableCell>
                  <TableCell>
                    <StatusPill active={coefficient.is_active ?? true} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onView(coefficient)}
                      >
                        <Eye />
                        View
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={!canManage}
                        onClick={() => onPatch(coefficient)}
                      >
                        <Save />
                        Rate
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <Pagination page={page} total={data.count} onPageChange={onPageChange} />
    </>
  );
};

const CoefficientDetailDialog = ({
  coefficient,
  setCoefficient,
}: {
  coefficient: QailosCoefficient | null;
  setCoefficient: (coefficient: QailosCoefficient | null) => void;
}) => {
  return (
    <Dialog
      open={!!coefficient}
      onOpenChange={(open) => !open && setCoefficient(null)}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Coefficient Details</DialogTitle>
          <DialogDescription>
            {coefficient?.code ?? "Qailos pricing coefficient"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 md:grid-cols-2">
          <DetailItem label="ID" value={coefficient?.id ?? "-"} />
          <DetailItem label="Code" value={coefficient?.code ?? "-"} />
          <DetailItem label="Provider" value={coefficient?.provider ?? "-"} />
          <DetailItem label="Model" value={coefficient?.model ?? "-"} />
          <DetailItem label="Component" value={coefficient?.component ?? "-"} />
          <DetailItem label="Unit type" value={coefficient?.unit_type ?? "-"} />
          <DetailItem
            label="Qailos/token"
            value={coefficient?.qailos_per_token ?? "-"}
          />
          <DetailItem
            label="EUR/token"
            value={coefficient?.eur_per_token ?? "-"}
          />
          <DetailItem
            label="Status"
            value={(coefficient?.is_active ?? true) ? "Active" : "Inactive"}
          />
          <div className="flex justify-end gap-2 md:col-span-2">
            <Button type="button" onClick={() => setCoefficient(null)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="rounded-md border p-3">
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className="mt-1 break-words text-sm font-medium">{value}</div>
  </div>
);

const RatePatchDialog = ({
  coefficient,
  token,
  setCoefficient,
}: {
  coefficient: QailosCoefficient | null;
  token: string;
  setCoefficient: (coefficient: QailosCoefficient | null) => void;
}) => {
  const [rateSource, setRateSource] = useState<RateSource>("qailos_per_token");
  const [value, setValue] = useState("");
  const [patchCoefficient, patchState] = usePatchQailosCoefficientMutation();

  useEffect(() => {
    if (coefficient) {
      setRateSource("qailos_per_token");
      setValue(coefficient.qailos_per_token);
    }
  }, [coefficient]);

  const submit = async () => {
    if (!coefficient) {
      return;
    }

    if (!coefficient.id) {
      toastMessage(
        "error",
        "Error",
        "This coefficient cannot be updated without an id."
      );
      return;
    }

    if (!value.trim()) {
      toastMessage(
        "error",
        "Error",
        `Please enter ${rateSourceLabels[rateSource]}.`
      );
      return;
    }

    try {
      await patchCoefficient({
        id: coefficient.id,
        token,
        data:
          rateSource === "qailos_per_token"
            ? { qailos_per_token: value.trim() }
            : { eur_per_token: value.trim() },
      }).unwrap();
      toastMessage("success", "Success", `${coefficient.code} rate updated.`);
      setCoefficient(null);
    } catch (error) {
      toastMessage("error", "Error", getApiError(error));
    }
  };

  return (
    <Dialog
      open={!!coefficient}
      onOpenChange={(open) => !open && setCoefficient(null)}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Update Rate</DialogTitle>
          <DialogDescription>
            {coefficient?.code ?? "Coefficient"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Field label="Rate source">
            <RateSourceControl value={rateSource} onChange={setRateSource} />
          </Field>
          <Field label={rateSourceLabels[rateSource]}>
            <Input
              inputMode="decimal"
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </Field>
          <div className="grid gap-2 rounded-md border p-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">
                Current Qailos/token
              </span>
              <span className="font-medium">
                {coefficient?.qailos_per_token ?? "-"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Current EUR/token</span>
              <span className="font-medium">
                {coefficient?.eur_per_token ?? "-"}
              </span>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCoefficient(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={patchState.isLoading || !token}
              onClick={submit}
            >
              {patchState.isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QailoManagement;
