import { type Dispatch, type SetStateAction, useState } from "react";

import { Mail, MapPin, Phone } from "lucide-react";

import LoginIconImg from "@/assets/img/login2.svg";

import DataBar from "../dashboard/data-bar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Sheet, SheetContent } from "../ui/sheet";

interface SheetTriggerProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const UserBar = ({ open, setOpen }: SheetTriggerProps) => {
  const [payStatus, setPayStatus] = useState<string>("paid");

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <div className="flex h-full w-full flex-col items-start justify-start">
          <div className="flex w-full items-center justify-center">
            <img src={LoginIconImg} alt="login-icon-img" className="size-40" />
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-1.5 border-b pb-2.5">
            <span className="w-full text-center text-xl font-bold">
              John Doe
            </span>
            <span className="w-full text-center text-sm text-gray-400">
              UI/UX Designer
            </span>
          </div>
          <div className="flex w-full items-center justify-center border-b py-2.5">
            <span className="flex-1 text-left text-sm">Payment Status:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="capitalize">
                  {payStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="mt-1.5 w-52 rounded-md border p-2.5"
                align="end"
              >
                <DropdownMenuRadioGroup
                  value={payStatus}
                  onValueChange={(e) => setPayStatus(e)}
                >
                  <DropdownMenuRadioItem value="paid">
                    Paid
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="unpaid">
                    Unpaid
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-2.5 py-2.5">
            <span className="w-full text-left text-xl font-bold">
              Contact Info
            </span>
            <div className="flex w-full items-center justify-center gap-2.5">
              <Mail className="size-4 text-primary" />
              <span className="flex-1 text-left text-sm">
                johndoe@email.com
              </span>
            </div>
            <div className="flex w-full items-center justify-center gap-2.5 border-y py-2.5">
              <Phone className="size-4 text-primary" />
              <span className="flex-1 text-left text-sm">+1 234 567 890</span>
            </div>
            <div className="flex w-full items-center justify-center gap-2.5">
              <MapPin className="size-4 text-primary" />
              <span className="flex-1 text-left text-sm">
                2239, Hog Camp, Road Schaumburg
              </span>
            </div>
          </div>
          <div className="flex h-full w-full items-center justify-center pt-2.5">
            <DataBar />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserBar;
