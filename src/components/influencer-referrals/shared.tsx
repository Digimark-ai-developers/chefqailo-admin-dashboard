import { type ReactNode } from "react";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import CustomToast from "@/components/ui/custom-toast";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { pageSize } from "./constants";

export const toastMessage = (
  type: "success" | "error" | "info",
  title: string,
  description: string
) => {
  toast.custom(() => (
    <CustomToast type={type} title={title} description={description} />
  ));
};

export const StatusPill = ({ active }: { active: boolean }) => (
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

export const ValidPill = ({ valid }: { valid: boolean }) => (
  <span
    className={cn(
      "inline-flex min-w-14 items-center justify-center rounded-md px-2 py-1 text-xs font-medium",
      valid ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
    )}
  >
    {valid ? "Valid" : "Invalid"}
  </span>
);

export const Field = ({
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

export const EmptyState = ({ message }: { message: string }) => (
  <div className="flex h-40 w-full items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
    {message}
  </div>
);

export const LoadingState = () => (
  <div className="flex h-40 w-full items-center justify-center">
    <Loader2 className="size-8 animate-spin text-primary" />
  </div>
);

export const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="rounded-md border p-3">
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className="mt-1 break-words text-sm font-medium">{value}</div>
  </div>
);

export const Pagination = ({
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
