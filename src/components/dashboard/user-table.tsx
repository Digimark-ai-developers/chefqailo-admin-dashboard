import { useEffect, useState } from "react";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import {
  Activity,
  Edit,
  EllipsisVertical,
  Gift,
  Loader2,
  Trash2,
} from "lucide-react";
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
import { useGiftTokensMutation } from "@/store/services/token";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
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
  const [giftTokens] = useGiftTokensMutation();
  const [users, setUsers] = useState<User[]>([]);
  const [warn, setWarn] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [toggleActive] = useToggleUserStatusMutation();
  const [selected, setSelected] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string>("");
  const { data, isLoading } = useGetAllUsersQuery(accessToken, {
    skip: !accessToken || accessToken === "",
    refetchOnMountOrArgChange: true,
  });
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();

  const handleToken = async () => {
    let token: string | undefined = "";

    if (getIdToken) {
      token = await getIdToken();
    }

    if (token) {
      setAccessToken(token);
    }
  };

  const changeUserStatus = async (id: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === parseInt(id)
          ? { ...user, is_active: !user.is_active }
          : user
      )
    );

    try {
      await toggleActive({
        id: parseInt(id),
        token: accessToken,
      });

      toast.custom(() => (
        <CustomToast
          type="success"
          title="Success"
          description="Successfully Changed User Status!"
        />
      ));
    } catch (error) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === parseInt(id)
            ? { ...user, is_active: !user.is_active }
            : user
        )
      );

      toast.custom(() => (
        <CustomToast
          type="error"
          title="Error"
          // @ts-ignore
          description={`${response.error.data.message}`}
        />
      ));
    }
  };

  const handleDelete = async (id: string) => {
    const response = await deleteUser({
      id: `${id}`,
      token: accessToken,
    });

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
          // @ts-ignore
          description={`${response.error.data.message}`}
        />
      ));
    }
  };

  useEffect(() => {
    handleToken();

    if (data) {
      setUsers(data);
    }
  }, [data, getIdToken]);

  const giftUserTokens = async (id: number) => {
    let response = null;
    const userToken = await getIdToken();

    if (userToken) {
      response = await giftTokens({
        id,
        token: userToken,
      });
    }

    if (!response?.error) {
      toast.custom(() => (
        <CustomToast
          type="success"
          title="Success"
          description="Successfully Gifted Tokens!"
        />
      ));
    } else {
      toast.custom(() => (
        <CustomToast
          type="error"
          title="Error"
          description="Failed to Gift Tokens!"
        />
      ));
    }
  };

  return (
    <>
      <AddUserDialog id={parseInt(selected)} open={open} setOpen={setOpen} />
      <WarningModal
        open={warn}
        message={message}
        setOpen={setWarn}
        loading={deleting}
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
                <TableHead>Payment Plan</TableHead>
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
                  <TableCell>
                    <span className="rounded-full px-2 py-0.5 font-medium capitalize">
                      {user.payment_status}
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
                        <DropdownMenuItem
                          onClick={() => {
                            setSelected(`${user.id}`);
                            setOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelected(`${user.id}`);
                            setMessage("Delete this user");
                            setWarn(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4 text-red-500" />{" "}
                          Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => giftUserTokens(user.id)}
                        >
                          <Gift className="mr-2 h-4 w-4 text-yellow-500" /> Gift
                          Qailos
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Activity className="mr-2 h-4 w-4 text-blue-500" />
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
