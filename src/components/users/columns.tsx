/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUpDown, EllipsisVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import {
  useDeleteUserMutation,
  useToggleUserPaidStatusMutation,
  useToggleUserStatusMutation,
} from "@/store/services/user";

import { Button } from "../ui/button";
import CustomToast from "../ui/custom-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Switch } from "../ui/switch";
import WarningModal from "../warning-modal";
import AddUserDialog from "./add-user-dialog";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center gap-2.5 font-medium">
          <img
            src="https://ui.shadcn.com/avatars/04.png"
            alt="user-dp"
            className="size-6 rounded-full"
          />
          <span className="hidden flex-1 overflow-hidden truncate md:flex">
            {row.getValue("username") !== ""
              ? row.getValue("username")
              : `${row.getAllCells()[0].row.original.first_name} ${row.getAllCells()[0].row.original.last_name}`}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              Status
              <ArrowDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="mt-1.5 w-52 rounded-md border p-2.5"
            align="end"
          >
            <DropdownMenuRadioGroup
              value={column.getFilterValue()?.toString()}
              onValueChange={(e) => column.setFilterValue(e)}
            >
              <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="true">Active</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="false">
                Inactive
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const cellValue = row.getValue(columnId);
      return filterValue ? `${cellValue}` === filterValue : true;
    },
    cell: ({ row }) => {
      const [toggleActive] = useToggleUserStatusMutation();

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

      return (
        <Switch
          onClick={() => changeUserStatus(`${row.getValue("email")}`)}
          checked={row.getValue("status")}
        />
      );
    },
  },
  {
    accessorKey: "is_paid",
    header: ({ column }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              Payment Status
              <ArrowDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="mt-1.5 w-52 rounded-md border p-2.5"
            align="end"
          >
            <DropdownMenuRadioGroup
              value={column.getFilterValue()?.toString()}
              onValueChange={(e) => column.setFilterValue(e)}
            >
              <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="true">Paid</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="false">
                Unpaid
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const cellValue = row.getValue(columnId);
      return filterValue ? `${cellValue}` === filterValue : true;
    },
    cell: ({ row }) => {
      const [togglePaid] = useToggleUserPaidStatusMutation();

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

      return (
        <span
          onClick={() => changeUserPaidStatus(`${row.getValue("email")}`)}
          className="cursor-pointer rounded-full bg-primary/20 px-2 py-0.5 font-medium capitalize text-primary"
        >
          {row.getValue("is_paid") ? "paid" : "unpaid"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const [deleteUser] = useDeleteUserMutation();
      const [warn, setWarn] = useState<boolean>(false);
      const [open, setOpen] = useState<boolean>(false);
      const [message, setMessage] = useState<string>("");
      const [selected, setSelected] = useState<string>("");

      const handleDelete = async (id: number) => {
        const response = await deleteUser(id);

        if (!response.error) {
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
          <AddUserDialog
            id={parseInt(selected)}
            open={open}
            setOpen={setOpen}
          />
          <WarningModal
            open={warn}
            setOpen={setWarn}
            message={message}
            cta={() => handleDelete(parseInt(selected))}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <EllipsisVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-5 w-auto">
              <DropdownMenuItem
                onClick={() => {
                  setSelected(`${row.getAllCells()[0].row.original.id}`);
                  setOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelected(`${row.getAllCells()[0].row.original.id}`);
                  setMessage("delete this user");
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
        </>
      );
    },
  },
];
