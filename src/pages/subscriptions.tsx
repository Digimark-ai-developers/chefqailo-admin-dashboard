import { useState } from "react";

import { Loader2, Plus } from "lucide-react";

import AddPlanDialog from "@/components/subscriptions/add-plan-dialog";
import DataLine from "@/components/subscriptions/data-line";
import PlanCard from "@/components/subscriptions/plan-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { plans } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useGetSubscriptionStatsQuery } from "@/store/services/subscriptions";

const Subscriptions = () => {
  const [add, setAdd] = useState<boolean>(false);
  const [position, setPosition] = useState<string>("weekly");
  const { data, isLoading } = useGetSubscriptionStatsQuery(position, {
    refetchOnMountOrArgChange: true,
  });

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
              onClick={() => setAdd(true)}
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
        <div className="grid w-full grid-cols-4 gap-5">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
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
