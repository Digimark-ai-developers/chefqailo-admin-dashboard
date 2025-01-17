import { useState } from "react";

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

const Subscriptions = () => {
  const [position, setPosition] = useState<string>("weekly");

  return (
    <div className="flex h-full w-full flex-col items-start justify-start gap-5">
      <div className="flex w-full items-center justify-center">
        <span className="flex-1 text-left text-xl font-semibold">
          Subscriptions
        </span>
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
      <div className="grid w-full grid-cols-4 gap-5">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
      <div className="flex h-full w-full items-start justify-start">
        <DataLine />
      </div>
    </div>
  );
};

export default Subscriptions;
