import { useEffect, useState } from "react";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import AddPlanDialog from "@/components/subscriptions/add-plan-dialog";
import DataLine from "@/components/subscriptions/data-line";
import PlanCard from "@/components/subscriptions/plan-card";
import { Button } from "@/components/ui/button";
import CustomToast from "@/components/ui/custom-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  useGetPlansQuery,
  useGetSubscriptionStatsQuery,
} from "@/store/services/subscriptions";

const Subscriptions = () => {
  const { getIdToken } = useKindeAuth();
  const [add, setAdd] = useState<boolean>(false);
  const [position, setPosition] = useState<string>("weekly");
  const [accessToken, setAccessToken] = useState<string>("");
  const { data, isLoading } = useGetSubscriptionStatsQuery(
    {
      period: position,
      token: `${accessToken}`,
    },
    {
      skip: !accessToken || accessToken === "",
      refetchOnMountOrArgChange: true,
    }
  );
  const { data: plans, isLoading: fetching } = useGetPlansQuery(accessToken, {
    skip: !accessToken || accessToken === "",
    refetchOnMountOrArgChange: true,
  });

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
    <>
      <AddPlanDialog open={add} setOpen={setAdd} />
      <div className="flex h-full w-full flex-col items-start justify-start gap-5">
        <div className="flex w-full items-center justify-center">
          <span className="flex-1 text-left text-xl font-semibold">
            Subscriptions
          </span>
          <div className="flex items-center justify-center gap-5">
            <Button
              type="button"
              onClick={() => {
                if (plans?.length === 4) {
                  toast.custom(() => (
                    <CustomToast
                      type="error"
                      title="Error"
                      description="You cannot add more than 4 plans."
                    />
                  ));
                } else {
                  setAdd(true);
                }
              }}
              variant="default"
              size="sm"
            >
              <Plus />
              Add Plan
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="capitalize">
                  {position}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-auto">
                <DropdownMenuRadioGroup
                  value={position}
                  onValueChange={setPosition}
                >
                  <DropdownMenuRadioItem value="weekly">
                    Weekly
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="monthly">
                    Monthly
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="yearly">
                    Yearly
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div
          className={cn("grid w-full grid-cols-4 gap-5", {
            "h-full": fetching,
          })}
        >
          {fetching ? (
            <div className="col-span-4 flex h-full w-full items-center justify-center">
              <Loader2 className="size-10 animate-spin text-primary" />
            </div>
          ) : (
            plans?.map((plan, idx) => <PlanCard key={idx} plan={plan} />)
          )}
        </div>
        <div
          className={cn("flex h-full w-full items-start justify-start", {
            "items-center justify-center": isLoading,
          })}
        >
          {isLoading ? (
            <Loader2 className="size-10 animate-spin text-primary" />
          ) : (
            <DataLine data={data!} />
          )}
        </div>
      </div>
    </>
  );
};

export default Subscriptions;
