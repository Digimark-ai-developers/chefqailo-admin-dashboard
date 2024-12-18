import { useState } from "react";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { EllipsisVertical, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, truncateString } from "@/lib/utils";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useToggleUserPaidStatusMutation,
  useToggleUserStatusMutation,
} from "@/store/services/user";

import CustomToast from "../ui/custom-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Switch } from "../ui/switch";
import AddUserDialog from "../users/add-user-dialog";
import WarningModal from "../warning-modal";

const UserTable = () => {
  const { getIdToken } = useKindeAuth();
  const [deleteUser] = useDeleteUserMutation();
  const [warn, setWarn] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [toggleActive] = useToggleUserStatusMutation();
  const [selected, setSelected] = useState<string>("");
  const [togglePaid] = useToggleUserPaidStatusMutation();
  const { data: users, isLoading } = useGetAllUsersQuery({});

  const changeUserStatus = async (id: string) => {
    const response = await toggleActive(id);

    if (!response.error) {
      toast.custom(() => (
        <CustomToast
          type="success"
          title="Success"
          description="Successfully Changed User Status!"
        />
      ));
    } else {
      toast.custom(() => (
        <CustomToast
          type="error"
          title="Error"
          description="Something went wrong!"
        />
      ));
    }
  };

  const changeUserPaidStatus = async (id: string) => {
    const response = await togglePaid(id);

    if (!response.error) {
      toast.custom(() => (
        <CustomToast
          type="success"
          title="Success"
          description="Successfully Changed User Payment Status!"
        />
      ));
    } else {
      toast.custom(() => (
        <CustomToast
          type="error"
          title="Error"
          description="Something went wrong!"
        />
      ));
    }
  };

  const handleDelete = async (id: string) => {
    let response = null;
    const userToken = await getIdToken();

    if (userToken) {
      response = await deleteUser({
        id: `${id}`,
        token: userToken,
      });
    }

    if (!response?.error) {
      toast.custom(() => (
        <CustomToast
          type="success"
          title="Success"
          description="Successfully Deleted User!"
        />
      ));
    } else {
      toast.custom(() => (
        <CustomToast
          type="error"
          title="Error"
          description="Something went wrong!"
        />
      ));
    }
  };

  return (
    <>
      <AddUserDialog id={1} open={open} setOpen={setOpen} />
      <WarningModal
        open={warn}
        message={message}
        setOpen={setWarn}
        cta={() => handleDelete(selected)}
      />
      <div className="max-h-full w-full overflow-y-auto rounded-xl border">
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
                <TableHead>Payment Status</TableHead>
                <TableHead className="w-[65px] rounded-tr-lg">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="h-full max-h-full w-full overflow-y-auto">
              {users?.map((user) => (
                <TableRow
                  key={user.id}
                  className={cn({
                    "bg-muted": user.id % 2 !== 0,
                    "rounded-br-xl": user.id === users.length,
                  })}
                >
                  <TableCell
                    className={cn(
                      "flex items-center justify-center gap-2.5 font-medium",
                      {
                        "rounded-bl-lg": user.id === users.length,
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
                    <span className="flex-1 overflow-hidden truncate md:hidden">
                      {user.username !== ""
                        ? truncateString(user.username, 4)
                        : truncateString(
                            `${user.first_name} ${user.last_name}`,
                            4
                          )}
                    </span>
                    <span className="hidden flex-1 overflow-hidden truncate md:flex">
                      {user.username !== ""
                        ? user.username
                        : `${user.first_name} ${user.last_name}`}
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
                  <TableCell>
                    <span
                      onClick={() => changeUserPaidStatus(`${user.id}`)}
                      className="cursor-pointer rounded-full bg-primary/20 px-2 py-0.5 font-medium capitalize text-primary"
                    >
                      {user.is_paid ? "paid" : "unpaid"}
                    </span>
                  </TableCell>
                  <TableCell
                    className={cn("flex w-[65px] items-center justify-center", {
                      "rounded-br-lg": user.id === users.length,
                    })}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <EllipsisVertical />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="mr-5 w-auto">
                        <DropdownMenuItem onClick={() => setOpen(true)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelected(`${user.id}`);
                            setMessage("Delete this user");
                            setWarn(true);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link to="/users/habit-tracker">Habit Tracking</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
};

export default UserTable;
