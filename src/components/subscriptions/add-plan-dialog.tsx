import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  useAddPlanMutation,
  useEditPlanMutation,
  useGetPlanQuery,
} from "@/store/services/subscriptions";
import { getAdminAccessToken } from "@/lib/admin-auth";

import { Button } from "../ui/button";
import CustomToast from "../ui/custom-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface AddPlanDialogProps {
  open: boolean;
  id?: number | null;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const planFormSchema = z
  .object({
    payment_status: z.enum(["free", "basic", "standard", "premium"], {
      errorMap: () => ({
        message:
          "Please select a valid payment plan (Free, Basic, Standard, or Premium).",
      }),
    }),
    amount: z
      .string()
      .refine((val) => !isNaN(Number(val)), {
        message: "Amount must be a valid number.",
      })
      .refine((val) => Number(val) >= 0, {
        message: "Amount cannot be negative.",
      }),
  })
  .refine(
    (data) => !(data.payment_status === "free" && Number(data.amount) !== 0),
    {
      message: "Amount must be 0 for a Free plan.",
      path: ["amount"],
    }
  );

const AddPlanDialog = ({ id, open, setOpen }: AddPlanDialogProps) => {
  const [accessToken, setAccessToken] = useState<string>("");
  const [addPlan, { isLoading: adding }] = useAddPlanMutation();
  const [editPlan, { isLoading: editing }] = useEditPlanMutation();
  const { data } = useGetPlanQuery(
    {
      id: `${id}`,
      token: accessToken,
    },
    {
      skip: !open || !accessToken || accessToken === "" || !id,
      refetchOnMountOrArgChange: true,
    }
  );

  const form = useForm<z.infer<typeof planFormSchema>>({
    resolver: zodResolver(planFormSchema),
  });

  const handleToken = async () => {
    const token = getAdminAccessToken();

    if (token) {
      setAccessToken(token);
    }
  };

  const onSubmit = async (values: z.infer<typeof planFormSchema>) => {
    let response = null;

    if (!id) {
      response = await addPlan({
        plan: {
          payment_status: values.payment_status,
          amount: Number(values.amount),
        },
        token: accessToken,
      });
    } else {
      response = await editPlan({
        id: `${id}`,
        plan: {
          payment_status: values.payment_status,
          amount: Number(values.amount),
        },
        token: accessToken,
      });
    }

    if (!response.error) {
      toast.custom(() => (
        <CustomToast
          type="success"
          title="Success"
          description={response.data.message}
        />
      ));

      setOpen(false);
    } else {
      toast.custom(() => (
        <CustomToast
          type="error"
          title="Error"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          description={response.error.data.message}
        />
      ));
    }

    form.reset();
  };

  useEffect(() => {
    handleToken();

    if (data) {
      // @ts-ignore
      form.setValue("payment_status", data.payment_status);
      form.setValue("amount", String(data.amount));
    }
  }, [data]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm md:max-w-md">
        <DialogHeader>
          <DialogTitle>{id ? "Edit" : "Add"} Plan</DialogTitle>
          <DialogDescription>
            {id ? "Edit user here" : "Add a new plan here"}. Click save when
            you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid w-full grid-cols-2 gap-5"
          >
            <FormField
              control={form.control}
              name="payment_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Free" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={9999}
                      placeholder="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-2 flex w-full items-center justify-end gap-2.5">
              <Button
                onClick={() => setOpen(false)}
                type="button"
                variant="outline"
                size="default"
              >
                Cancel
              </Button>
              <Button
                disabled={adding || editing}
                type="submit"
                variant="default"
                size="default"
              >
                {adding || editing ? (
                  <div className="flex w-full items-center justify-center gap-2">
                    <Loader2 className="animate-spin" />
                    <span>Please Wait...</span>
                  </div>
                ) : (
                  "Save changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPlanDialog;
