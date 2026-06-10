import { useState } from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader2,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AddUserDialog from "./add-user-dialog";
import UserBar from "./user-bar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isFetching?: boolean;
  startDate: string;
  endDate: string;
  isDateFilterActive: boolean;
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onApplyDateFilters: () => void;
  onClearDateFilters: () => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

const DataTable = <TData, TValue>({
  columns,
  data,
  isFetching = false,
  startDate,
  endDate,
  isDateFilterActive,
  page,
  pageSize,
  totalPages,
  totalCount,
  onStartDateChange,
  onEndDateChange,
  onApplyDateFilters,
  onClearDateFilters,
  onNextPage,
  onPreviousPage,
}: DataTableProps<TData, TValue>) => {
  const [open, setOpen] = useState<boolean>(false);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>("");
  const [addUser, setAddUser] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const normalizedTotalPages = Math.max(1, totalPages);
  const canGoPrevious = page > 1 && !isFetching;
  const canGoNext = page < normalizedTotalPages && !isFetching;

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <>
      <UserBar open={open} setOpen={setOpen} id={selected} />
      <AddUserDialog open={addUser} setOpen={setAddUser} />
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="max-w-sm md:max-w-md">
          <DialogHeader>
            <DialogTitle>Filter users</DialogTitle>
            <DialogDescription>
              Select a created date range for the users list.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <label className="flex flex-col gap-1 text-sm font-medium">
              Start date
              <Input
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(event) => onStartDateChange(event.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium">
              End date
              <Input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(event) => onEndDateChange(event.target.value)}
              />
            </label>
          </div>
          <DialogFooter className="gap-2.5">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                table.resetColumnFilters();
                onClearDateFilters();
                setFilterOpen(false);
              }}
              disabled={isFetching}
            >
              <X className="size-4" />
              Remove all filters
            </Button>
            <Button
              type="button"
              onClick={() => {
                onApplyDateFilters();
                setFilterOpen(false);
              }}
              disabled={!startDate || !endDate || isFetching}
            >
              <Check className="size-4" />
              Apply filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex h-full w-full flex-col items-start justify-start gap-2.5 rounded-xl border p-2.5">
        <div className="flex w-full flex-col gap-2.5 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid w-full grid-cols-1 gap-2.5 md:grid-cols-[minmax(180px,1fr)_auto] xl:max-w-xl">
            <Input
              placeholder="Filter by name..."
              value={
                (table.getColumn("username")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("username")?.setFilterValue(event.target.value)
              }
            />
            <Button
              type="button"
              variant={isDateFilterActive ? "default" : "outline"}
              onClick={() => setFilterOpen(true)}
              className="relative"
            >
              <Filter className="size-4" />
              Filters
              {isDateFilterActive ? (
                <span className="absolute -right-1 -top-1 size-2 rounded-full bg-primary-foreground ring-2 ring-primary" />
              ) : null}
            </Button>
          </div>
        </div>
        <div className="h-[calc(100vh-212px)] w-full">
          <div className="h-full w-full overflow-hidden rounded-lg border">
            <div className="h-full overflow-y-scroll">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-background">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            onClick={() => {
                              if (cell.column.id === "username") {
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                setSelected(row.original.id);
                                setOpen(true);
                              }
                            }}
                            className={cn("overflow-hidden truncate px-6", {
                              "cursor-pointer": cell.column.id === "username",
                              capitalize: cell.column.id === "payment_status",
                            })}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-1 items-center justify-start gap-3">
            <span className="text-left text-sm text-muted-foreground">
              Items per page: {data.length}/{pageSize}
            </span>
            <span className="text-left text-sm text-muted-foreground">
              Total users: {totalCount.toLocaleString()}
            </span>
            <span className="text-left text-sm text-muted-foreground">
              Page&nbsp;{page}
              {totalCount > data.length || page > 1
                ? ` of ${normalizedTotalPages.toLocaleString()}`
                : null}
            </span>
            {isFetching ? (
              <Loader2 className="size-4 animate-spin text-primary" />
            ) : null}
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPreviousPage}
              disabled={!canGoPrevious}
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onNextPage}
              disabled={!canGoNext}
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataTable;
