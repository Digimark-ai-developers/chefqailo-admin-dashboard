/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUpDown, EllipsisVertical } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import WarningModal from "../warning-modal";
import AddUserDialog from "./add-user-dialog";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
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
              <DropdownMenuRadioItem value="paid">Paid</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="unpaid">
                Unpaid
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const cellValue = row.getValue(columnId);
      return filterValue ? cellValue === filterValue : true;
    },
    cell: ({ row }) => (
      <span className="rounded-full bg-primary/20 px-2 py-0.5 font-medium capitalize text-primary">
        {row.getValue("is_paid")}
      </span>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: () => {
      const [warn, setWarn] = useState<boolean>(false);
      const [open, setOpen] = useState<boolean>(false);
      const [selected, setSelected] = useState<string>("");

      return (
        <>
          <AddUserDialog id={1} open={open} setOpen={setOpen} />
          <WarningModal open={warn} setOpen={setWarn} message={selected} />
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
                  setSelected("delete this user");
                  setWarn(true);
                }}
              >
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelected("disable this user");
                  setWarn(true);
                }}
              >
                Disable
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/habit-tracker">Habit Tracking</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
