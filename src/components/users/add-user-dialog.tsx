import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

import {
  useEditUserMutation,
  useGetUserQuery,
  usePostUserMutation,
} from "@/store/services/user";

import { Button } from "../ui/button";
import CustomToast from "../ui/custom-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

interface AddUserDialogProps {
  open: boolean;
  id?: number | null;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const AddUserDialog = ({ id, open, setOpen }: AddUserDialogProps) => {
  const { data } = useGetUserQuery(`${id}`, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });
  const [email, setEmail] = useState<string>("");
  const [paid, setPaid] = useState<boolean>(false);
  const [lastName, setLastName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [addUser, { isLoading: adding }] = usePostUserMutation();
  const [editUser, { isLoading: editing }] = useEditUserMutation();

  const postUser = async () => {
    let response = null;

    const formData = new FormData();
    formData.append("email", email);
    formData.append("is_paid", `${paid}`);
    formData.append("last_name", lastName);
    formData.append("first_name", firstName);

    if (id) {
      response = await editUser({
        id: `${id}`,
        data: formData,
      });
    } else {
      response = await addUser(formData);
    }

    if (!response.error) {
      toast.custom(() => (
        <CustomToast
          type="success"
          title="Success"
          description="Successfully Added User!"
        />
      ));

      setOpen(false);
    } else {
      toast.custom(() => (
        <CustomToast
          type="error"
          title="Error"
          description="Something went wrong!"
        />
      ));
    }
  };

  useEffect(() => {
    if (data) {
      setEmail(data.email);
      setPaid(data.is_paid);
      setLastName(data.last_name);
      setFirstName(data.first_name);
    }
  }, [data]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm md:max-w-md">
        <DialogHeader>
          <DialogTitle>{id ? "Edit" : "Add"} User</DialogTitle>
          <DialogDescription>
            {id ? "Edit user here" : "Add a new user here"}. Click save when
            you're done.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            postUser();
          }}
          className="grid w-full grid-cols-2 gap-5"
        >
          <div className="col-span-1 flex w-full flex-col items-center justify-center gap-1.5">
            <Label htmlFor="firstName" className="w-full text-left text-xs">
              First Name
            </Label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              id="firstName"
              type="text"
              placeholder="John"
              required
            />
          </div>
          <div className="col-span-1 flex w-full flex-col items-center justify-center gap-1.5">
            <Label htmlFor="lastName" className="w-full text-left text-xs">
              Last Name
            </Label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              id="lastName"
              type="text"
              placeholder="Doe"
              required
            />
          </div>
          <div className="col-span-2 flex w-full flex-col items-center justify-center gap-1.5">
            <Label htmlFor="email" className="w-full text-left text-xs">
              Email
            </Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              type="email"
              required
              placeholder="johndoe@email.com"
            />
          </div>
          <div className="col-span-2 flex w-full items-center space-x-2">
            <Label
              htmlFor="payment-status"
              className="flex-1 text-left text-sm"
            >
              Payment Status:
            </Label>
            <div className="flex items-center justify-center gap-2.5">
              <span className="text-sm font-medium">Unpaid</span>
              <Switch checked={paid} onCheckedChange={setPaid} />
              <span className="text-sm font-medium text-primary">Paid</span>
            </div>
          </div>
          <div className="col-span-2 flex w-full flex-col items-center justify-center gap-1.5">
            <Label className="w-full text-left text-sm">
              Upload Profile Picture
            </Label>
            <div className="flex w-full flex-col items-center justify-center gap-5 rounded-lg border-2 border-dashed border-primary bg-muted p-5">
              <Upload className="size-14 text-primary" />
              <div className="flex w-full flex-col items-center justify-center gap-1">
                <span className="w-full text-center text-sm">
                  <span className="text-primary">Drag & Drop</span> or&nbsp;
                  <br />
                  <span className="text-primary">Click</span> to Upload
                </span>
              </div>
            </div>
          </div>
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
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
