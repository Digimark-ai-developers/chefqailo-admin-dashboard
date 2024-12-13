import { type Dispatch, type SetStateAction } from "react";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Link } from "react-router-dom";

import { yearlyProgress } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { buttonVariants } from "../ui/button";
import ConicGradient from "../ui/conic-gradient";
import { Sheet, SheetContent } from "../ui/sheet";
import PaymentHistory from "./payment-history";

interface SheetTriggerProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const UserBar = ({ open, setOpen }: SheetTriggerProps) => {
  const { user } = useKindeAuth();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <div className="flex h-full w-full flex-col items-start justify-start gap-5">
          <div className="flex w-full items-center justify-center gap-2.5 border-b pb-5">
            <img
              src="https://ui.shadcn.com/avatars/04.png"
              alt="user-picture"
              className="size-16 rounded-full bg-primary"
            />
            <div className="flex flex-1 flex-col items-center justify-center gap-1">
              <span className="w-full text-left text-lg font-bold leading-[18px]">
                {user?.given_name}&nbsp;{user?.family_name}
              </span>
              <span className="w-full overflow-hidden truncate text-left text-xs text-gray-400">
                {user?.email}
              </span>
              <span className="w-full overflow-hidden truncate text-left text-xs text-gray-400">
                Paid | Active
              </span>
            </div>
          </div>
          <div className="flex h-full w-full flex-col items-start justify-start gap-5 rounded-lg">
            <div className="flex h-fit w-full items-center justify-center">
              <span className="flex-1 text-left text-xl font-semibold">
                Habit Tracker
              </span>
              <Link
                to="/users/habit-tracker"
                className={cn(
                  buttonVariants({
                    size: "sm",
                    variant: "default",
                  })
                )}
              >
                View More
              </Link>
            </div>
            <div className="flex h-fit w-full flex-col items-start justify-start gap-2.5">
              {yearlyProgress.slice(0, 9).map((item) => (
                <div
                  key={item.id}
                  className="flex w-full items-center justify-center rounded-md bg-muted p-3"
                >
                  <span className="flex-1 text-left font-semibold">
                    {item.name}
                  </span>
                  <ConicGradient size="size-6" progress={item.progress} />
                </div>
              ))}
            </div>
            <PaymentHistory />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserBar;
