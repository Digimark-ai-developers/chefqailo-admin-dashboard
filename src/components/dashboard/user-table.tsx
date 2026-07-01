import { useEffect, useMemo, useState } from "react";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminAccessToken } from "@/hooks/use-admin-access-token";
import { cn, truncateString } from "@/lib/utils";
import {
  useGetAllUsersQuery,
  useToggleUserStatusMutation,
} from "@/store/services/user";

import { Button } from "../ui/button";
import CustomToast from "../ui/custom-toast";
import { Switch } from "../ui/switch";

const USERS_PAGE_SIZE = 10;

const UserTable = () => {
  const [page, setPage] = useState<number>(1);
  const [optimisticStatus, setOptimisticStatus] = useState<
    Record<number, boolean>
  >({});
  const [toggleActive] = useToggleUserStatusMutation();
  const accessToken = useAdminAccessToken();
  const { data, isFetching, isLoading } = useGetAllUsersQuery(
    {
      token: accessToken,
      page,
      limit: USERS_PAGE_SIZE,
    },
    {
      skip: !accessToken,
      refetchOnMountOrArgChange: true,
    }
  );
  const totalUsers = data?.count ?? 0;
  const totalPages = data?.total_pages ?? 1;
  const users = useMemo(
    () =>
      (data?.results ?? []).map((user) => ({
        ...user,
        is_active: optimisticStatus[user.id] ?? user.is_active,
      })),
    [data?.results, optimisticStatus]
  );
  const canGoPrevious = page > 1 && !isFetching;
  const canGoNext = page < totalPages && !isFetching;

  const changeUserStatus = async (id: string) => {
    const userId = parseInt(id);
    const currentStatus = users.find((user) => user.id === userId)?.is_active;

    if (currentStatus === undefined) {
      return;
    }

    setOptimisticStatus((prev) => ({
      ...prev,
      [userId]: !currentStatus,
    }));

    try {
      await toggleActive({
        id: userId,
        token: accessToken,
      });

      toast.custom(() => (
        <CustomToast
          type="success"
          title="Success"
          description="Successfully Changed User Status!"
        />
      ));
    } catch {
      setOptimisticStatus((prev) => ({
        ...prev,
        [userId]: currentStatus,
      }));

      toast.custom(() => (
        <CustomToast
          type="error"
          title="Error"
          description="Failed to change user status."
        />
      ));
    }
  };

  useEffect(() => {
    if (data) {
      setOptimisticStatus({});
    }
  }, [data]);

  useEffect(() => {
    if (data && page > 1 && data.results.length === 0) {
      setPage((currentPage) => Math.max(1, currentPage - 1));
    }
  }, [data, page]);

  return (
    <div className="flex max-h-full w-full flex-col rounded-xl border">
      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex w-full items-center justify-center p-5">
            <Loader2 className="size-10 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background">
              <TableRow>
                <TableHead className="rounded-tl-lg">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="rounded-tr-lg">Payment Plan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="h-full max-h-full w-full overflow-y-auto">
              {users.length > 0 ? (
                users.map((user, index) => {
                  const isLastRow = index === users.length - 1;

                  return (
                    <TableRow
                      key={user.id}
                      className={cn({
                        "bg-muted": user.id % 2 !== 0,
                        "rounded-br-xl": isLastRow,
                      })}
                    >
                      <TableCell
                        className={cn(
                          "flex items-center justify-center gap-2.5 font-medium",
                          {
                            "rounded-bl-lg": isLastRow,
                          }
                        )}
                      >
                        <img
                          src={
                            user.image
                              ? user.image
                              : "https://ui.shadcn.com/avatars/04.png"
                          }
                          alt="user-dp"
                          className="size-6 rounded-full"
                        />
                        <span
                          title={`${user.first_name} ${user.last_name}`}
                          className="flex-1 overflow-hidden truncate"
                        >
                          {user.username !== ""
                            ? truncateString(user.username, 4)
                            : truncateString(
                                `${user.first_name} ${user.last_name}`,
                                4
                              )}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="flex-1 overflow-hidden truncate md:hidden">
                          {truncateString(user.email, 4)}
                        </span>
                        <span className="hidden flex-1 overflow-hidden truncate md:flex">
                          {user.email}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Switch
                          onClick={() => changeUserStatus(`${user.id}`)}
                          checked={user.is_active}
                        />
                      </TableCell>
                      <TableCell
                        className={cn({
                          "rounded-br-lg": isLastRow,
                        })}
                      >
                        <span className="rounded-full px-2 py-0.5 font-medium capitalize">
                          {user.payment_status}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
      {!isLoading && (
        <div className="flex w-full flex-col gap-2 border-t px-3 py-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span>
              Items per page: {users.length}/{USERS_PAGE_SIZE}
            </span>
            <span>Total users: {totalUsers.toLocaleString()}</span>
            <span>
              Page {page} of {totalPages}
            </span>
            {isFetching ? (
              <Loader2 className="size-4 animate-spin text-primary" />
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((currentPage) => currentPage - 1)}
              disabled={!canGoPrevious}
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((currentPage) => currentPage + 1)}
              disabled={!canGoNext}
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
