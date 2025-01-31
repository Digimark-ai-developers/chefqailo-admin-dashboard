import { useState } from "react";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Edit, Trash } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useDeletePlanMutation } from "@/store/services/subscriptions";

import { Button } from "../ui/button";
import CustomToast from "../ui/custom-toast";
import WarningModal from "../warning-modal";
import AddPlanDialog from "./add-plan-dialog";

// text-[hsl(var(--chart-1))]
// text-[hsl(var(--chart-2))]
// text-[hsl(var(--chart-3))]
// text-[hsl(var(--chart-4))]
// bg-[hsl(var(--chart-1))]/30
// bg-[hsl(var(--chart-2))]/30
// bg-[hsl(var(--chart-3))]/30
// bg-[hsl(var(--chart-4))]/30

const PlanCard = ({ plan }: { plan: Plan }) => {
  const { getIdToken } = useKindeAuth();
  const [deletePlan] = useDeletePlanMutation();
  const [edit, setEdit] = useState<boolean>(false);
  const [warn, setWarn] = useState<boolean>(false);

  const handleDelete = async (id: number) => {
    let response = null;
    const userToken = await getIdToken();

    if (userToken) {
      response = await deletePlan({ id: `${id}`, token: userToken });
    }

    if (!response?.error) {
      toast.custom(() => (
        <CustomToast
          type="success"
          title="Success"
          description={response?.data.message}
        />
      ));
    } else {
      toast.custom(() => (
        <CustomToast
          type="error"
          title="Error"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          description={response.error.error.data.message}
        />
      ));
    }
  };

  return (
    <>
      <AddPlanDialog open={edit} setOpen={setEdit} id={plan.id} />
      <WarningModal
        open={warn}
        setOpen={setWarn}
        message="Delete this Plan"
        cta={() => handleDelete(plan.id)}
      />
      <div className="flex w-full flex-col items-center justify-center gap-5 rounded-lg border p-2.5">
        <div className="flex w-full items-center justify-center">
          <div className="flex flex-1 flex-col items-center justify-center">
            <span
              className={cn(
                "w-full text-left font-medium capitalize",
                `text-[${plan.bgColor}]`
              )}
            >
              {plan.payment_status}
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
              `bg-[${plan.bgColor}]/30`
            )}
          >
            <span className={cn("text-xl font-bold", `text-[${plan.bgColor}]`)}>
              ${plan.amount}
            </span>
          </div>
        </div>
        <div className="flex w-full items-end justify-between gap-2.5">
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
        </div>
      </div>
    </>
  );
};

export default PlanCard;
