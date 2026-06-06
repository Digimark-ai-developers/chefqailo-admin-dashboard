import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

import { getAdminAccessToken } from "@/lib/admin-auth";
import { cn, truncateString } from "@/lib/utils";
import { useGetUserQuery } from "@/store/services/user";

import { Sheet, SheetContent } from "../ui/sheet";
import TokenHistory from "./token-history";

interface SheetTriggerProps {
  id: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const UserBar = ({ id, open, setOpen }: SheetTriggerProps) => {
  const [accessToken, setAccessToken] = useState<string>("");

  const { data } = useGetUserQuery(
    { id: `${id}`, token: `${accessToken}` },
    {
      skip: !open || !accessToken || accessToken === "",
      refetchOnMountOrArgChange: true,
    }
  );

  const handleToken = async () => {
    const token = getAdminAccessToken();

    if (token) {
      setAccessToken(token);
    }
  };

  useEffect(() => {
    handleToken();
  }, []);

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
              className="aspect-square size-16 rounded-full bg-primary object-cover"
            />
            <div className="flex flex-1 flex-col items-center justify-center gap-1">
              <span className="w-full text-left text-lg font-bold leading-[18px]">
                {truncateString(`${data?.first_name} ${data?.last_name}`, 10)}
              </span>
              <span className="w-full overflow-hidden truncate text-left text-xs text-gray-400">
                {data?.email}
              </span>
              <span className="w-full overflow-hidden truncate text-left text-xs capitalize text-gray-400">
                {data?.is_active ? "Active" : "Inactive"} |&nbsp;
                {data?.payment_status}
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
                  Qailos
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
