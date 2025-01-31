import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

import { cn } from "@/lib/utils";
import { useGetUserQuery } from "@/store/services/user";

import { Sheet, SheetContent } from "../ui/sheet";
import TokenHistory from "./token-history";

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
                {/* {data?.is_paid ? "Paid" : "Unpaid"}&nbsp;|&nbsp; */}
                {data?.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
          <div className="flex h-full w-full flex-col items-start justify-start gap-5 overflow-hidden rounded-lg">
            <div className="relative flex h-full max-h-full w-full flex-col items-start justify-start overflow-y-auto rounded-lg border">
              <div className="sticky top-0 z-[1] grid w-full grid-cols-3 bg-muted py-2.5">
                <span className="col-span-1 w-full text-center text-sm font-bold">
                  Date
                </span>
                <span className="col-span-1 w-full text-center text-sm font-bold">
                  Tokens
                </span>
                <span className="col-span-1 w-full text-center text-sm font-bold">
                  Price
                </span>
              </div>
              {[...Array(20)].map((_, idx) => (
                <div
                  key={idx}
                  className={cn("grid w-full grid-cols-3 py-2.5", {
                    "bg-primary/30": idx % 2 !== 0,
                  })}
                >
                  <span className="col-span-1 w-full text-center text-sm">
                    24-01-2025
                  </span>
                  <span className="col-span-1 w-full text-center text-sm">
                    1337
                  </span>
                  <span className="col-span-1 w-full text-center text-sm">
                    $213.34
                  </span>
                </div>
              ))}
            </div>
            <div className="h-full max-h-[238px] w-full">
              <TokenHistory />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserBar;
