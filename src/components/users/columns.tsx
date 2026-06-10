/* eslint-disable react-hooks/rules-of-hooks */
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

import { getAdminAccessToken } from "@/lib/admin-auth";
import { truncateString } from "@/lib/utils";
import { useToggleUserStatusMutation } from "@/store/services/user";

import { Button } from "../ui/button";
import CustomToast from "../ui/custom-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Switch } from "../ui/switch";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    header: () => {
      return <span className="px-4">Name</span>;
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center gap-2.5 font-medium">
          <img
            src={
              row.original.image
                ? row.original.image
                : "https://ui.shadcn.com/avatars/04.png"
            }
            alt="user-dp"
            className="size-6 rounded-full"
          />
          <span
            title={`${row.getAllCells()[0].row.original.first_name} ${row.getAllCells()[0].row.original.last_name}`}
            className="hidden flex-1 overflow-hidden truncate md:flex"
          >
            {row.getValue("username") !== ""
              ? row.getValue("username")
              : truncateString(
                  `${row.getAllCells()[0].row.original.first_name} ${row.getAllCells()[0].row.original.last_name}`,
                  10
                )}
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
    accessorKey: "is_active",
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
      const accessToken = getAdminAccessToken();
      const [toggleActive] = useToggleUserStatusMutation();

      const changeUserStatus = async (id: string) => {
        const response = await toggleActive({
          id: parseInt(id),
          token: accessToken,
        });

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
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              description={response.error.data.message}
            />
          ));
        }
      };

      return (
        <Switch
          onClick={() => changeUserStatus(`${row.original.id}`)}
          checked={row.getValue("is_active")}
        />
      );
    },
  },
  {
    accessorKey: "payment_status",
    header: ({ column }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              Payment Plan
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
              <DropdownMenuRadioItem value="Free">Free</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Basic">Basic</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Pro">Pro</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Premium">
                Premium
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
