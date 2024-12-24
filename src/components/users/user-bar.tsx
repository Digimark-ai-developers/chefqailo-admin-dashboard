import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Link } from "react-router-dom";

import { yearlyProgress } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useGetUserQuery } from "@/store/services/user";

import { buttonVariants } from "../ui/button";
import ConicGradient from "../ui/conic-gradient";
import { Sheet, SheetContent } from "../ui/sheet";
import PaymentHistory from "./payment-history";

interface SheetTriggerProps {
  id: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const UserBar = ({ id, open, setOpen }: SheetTriggerProps) => {
  const { getIdToken } = useKindeAuth();
  const [accessToken, setAccessToken] = useState<string>("");

  const { data } = useGetUserQuery(
    { id: `${id}`, token: `${accessToken}` },
    {
      skip: !open || !accessToken || accessToken === "",
      refetchOnMountOrArgChange: true,
    }
  );

  const handleToken = async () => {
    let token: string | undefined = "";

    if (getIdToken) {
      token = await getIdToken();
    }

    if (token) {
      setAccessToken(token);
    }
  };

  useEffect(() => {
    handleToken();
  }, [getIdToken]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <div className="flex h-full w-full flex-col items-start justify-start gap-5">
          <div className="flex w-full items-center justify-center gap-2.5 border-b pb-5">
            <img
              src={
                data?.image
                  ? data.image
                  : "https://ui.shadcn.com/avatars/04.png"
              }
              alt="user-picture"
              className="size-16 rounded-full bg-primary"
            />
            <div className="flex flex-1 flex-col items-center justify-center gap-1">
              <span className="w-full text-left text-lg font-bold leading-[18px]">
                {data?.first_name}&nbsp;{data?.last_name}
              </span>
              <span className="w-full overflow-hidden truncate text-left text-xs text-gray-400">
                {data?.email}
              </span>
              <span className="w-full overflow-hidden truncate text-left text-xs text-gray-400">
                {data?.is_paid ? "Paid" : "Unpaid"}&nbsp;|&nbsp;
                {data?.is_active ? "Active" : "Inactive"}
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
            <div className="flex h-[calc(100vh-454px)] w-full flex-col items-start justify-start gap-2.5 overflow-y-auto">
              {yearlyProgress.map((item) => (
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
            <div className="h-full max-h-[238px] w-full">
              <PaymentHistory />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserBar;
