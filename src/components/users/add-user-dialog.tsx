import type { Dispatch, SetStateAction } from "react";

import { Upload } from "lucide-react";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
        <div className="grid w-full grid-cols-2 gap-5">
          <div className="col-span-1 flex w-full flex-col items-center justify-center gap-1.5">
            <Label htmlFor="firstName" className="w-full text-left text-xs">
              First Name
            </Label>
            <Input id="firstName" type="text" placeholder="John" />
          </div>
          <div className="col-span-1 flex w-full flex-col items-center justify-center gap-1.5">
            <Label htmlFor="lastName" className="w-full text-left text-xs">
              Last Name
            </Label>
            <Input id="lastName" type="text" placeholder="Doe" />
          </div>
          <div className="col-span-2 flex w-full flex-col items-center justify-center gap-1.5">
            <Label htmlFor="email" className="w-full text-left text-xs">
              Email
            </Label>
            <Input id="email" type="email" placeholder="johndoe@email.com" />
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
              <Switch id="airplane-mode" />
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
        </div>
        <DialogFooter className="gap-2.5">
          <Button
            onClick={() => setOpen(false)}
            type="button"
            variant="outline"
            size="default"
          >
            Cancel
          </Button>
          <Button type="submit" variant="default" size="default">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
