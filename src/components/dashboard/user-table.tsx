import { useState } from "react";

import { EllipsisVertical } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { users } from "@/lib/constants";
import { cn, truncateString } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import AddUserDialog from "../users/add-user-dialog";
import WarningModal from "../warning-modal";

const UserTable = () => {
  const [warn, setWarn] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>("");

  return (
    <>
      <AddUserDialog id={1} open={open} setOpen={setOpen} />
      <WarningModal open={warn} message={selected} setOpen={setWarn} />
      <div className="h-[500px] w-full lg:h-[calc(100vh-434px)]">
        <div className="h-full w-full overflow-hidden rounded-lg border">
          <div className="h-full overflow-y-scroll">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-background">
                <TableRow>
                  <TableHead className="rounded-tl-lg">Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[65px] rounded-tr-lg">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="h-full max-h-full w-full overflow-y-auto">
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    className={cn({
                      "bg-muted": user.id % 2 !== 0,
                      "rounded-br-xl": user.id === users.length,
                    })}
                  >
                    <TableCell
                      className={cn("font-medium", {
                        "rounded-bl-lg": user.id === users.length,
                      })}
                    >
                      {truncateString(user.name, 6)}
                    </TableCell>
                    <TableCell>{truncateString(user.email, 10)}</TableCell>
                    <TableCell>
                      <span className="rounded-full bg-primary/20 px-2 py-0.5 font-medium capitalize text-primary">
                        {user.is_paid}
                      </span>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "flex w-[65px] items-center justify-center",
                        {
                          "rounded-br-lg": user.id === users.length,
                        }
                      )}
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
                              setSelected("Delete this user");
                              setWarn(true);
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelected("Disable this user");
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserTable;
