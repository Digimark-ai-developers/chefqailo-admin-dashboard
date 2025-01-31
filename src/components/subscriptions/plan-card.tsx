import { useState } from "react";

import { Edit, Trash, TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import WarningModal from "../warning-modal";
import AddPlanDialog from "./add-plan-dialog";

// text-chart-1
// text-chart-2
// text-chart-3
// text-chart-4
// bg-chart-1/30
// bg-chart-2/30
// bg-chart-3/30
// bg-chart-4/30

const PlanCard = ({ plan }: { plan: Plan }) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [warn, setWarn] = useState<boolean>(false);

  return (
    <>
      <AddPlanDialog open={edit} setOpen={setEdit} id={plan.id} />
      <WarningModal open={warn} setOpen={setWarn} message="Delete this Plan" />
      <div className="flex w-full flex-col items-center justify-center gap-5 rounded-lg border p-2.5">
        <div className="flex w-full items-center justify-center">
          <div className="flex flex-1 flex-col items-center justify-center">
            <span
              className={cn(
                "w-full text-left font-medium",
                `text-${plan.bgColor}`
              )}
            >
              {plan.name}
            </span>
            <p className="w-full text-left text-3xl font-bold">
              <span className="!leading-[30px]">{plan.users}</span>&nbsp;
              <span className="text-xs !leading-[12px] text-gray-500">
                this month
              </span>
            </p>
          </div>
          <div
            className={cn(
              "flex size-[62px] items-center justify-center rounded-full",
              `bg-${plan.bgColor}/30`
            )}
          >
            <span className={cn("text-xl font-bold", `text-${plan.bgColor}`)}>
              ${plan.price}
            </span>
          </div>
        </div>
        <div className="flex w-full items-end justify-center gap-2.5">
          <Button
            onClick={() => setEdit(true)}
            type="button"
            variant="outline"
            size="icon"
          >
            <Edit />
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="h-[36px]"
            onClick={() => setWarn(true)}
          >
            <Trash />
          </Button>
          <p
            className={cn(
              "flex flex-1 items-center justify-end text-xs font-semibold",
              {
                "text-green-400": plan.trend.includes("+"),
                "text-red-400": plan.trend.includes("-"),
              }
            )}
          >
            {plan.trend.includes("+") ? (
              <TrendingUp className="mr-1.5 size-4" />
            ) : (
              <TrendingDown className="mr-1.5 size-4" />
            )}
            {plan.trend}
          </p>
        </div>
      </div>
    </>
  );
};

export default PlanCard;
