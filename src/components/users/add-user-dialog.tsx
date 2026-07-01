import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useAdminAccessToken } from "@/hooks/use-admin-access-token";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import ImageUploader from "../ui/image-uploader";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface AddUserDialogProps {
  open: boolean;
  id?: number | null;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const userFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(10, { message: "Username must be at most 10 characters long" })
    .regex(/^[A-Za-z0-9]+$/, {
      message:
        "Username must only contain alphabets and numbers, no spaces or special characters",
    }),
  email: z.string().email({ message: "Invalid email address" }),
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .regex(/^[A-Za-z\s]+$/, {
      message: "First name must only contain alphabets and spaces",
    }),
  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .regex(/^[A-Za-z\s]+$/, {
      message: "Last name must only contain alphabets and spaces",
    }),
});

const AddUserDialog = ({ id, open, setOpen }: AddUserDialogProps) => {
  const accessToken = useAdminAccessToken();
  const [image, setImage] = useState<string | File | null>(null);

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
  });

  const { data } = useGetUserQuery(
    { id: `${id}`, token: `${accessToken}` },
    {
      skip: !open || !accessToken || accessToken === "" || !id,
      refetchOnMountOrArgChange: true,
    }
  );

  const [addUser, { isLoading: adding }] = usePostUserMutation();
  const [editUser, { isLoading: editing }] = useEditUserMutation();

  const postUser = async (values: z.infer<typeof userFormSchema>) => {
    let response = null;

    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("image", image as File);
    formData.append("username", values.username);
    formData.append("last_name", values.lastName);
    formData.append("first_name", values.firstName);

    if (id) {
      response = await editUser({
        id: `${id}`,
        data: formData,
        token: accessToken,
      });
    } else {
      response = await addUser({ data: formData, token: accessToken });
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
    setImage(null);
  };

  useEffect(() => {
    if (data?.user) {
      setImage(data.user.image);
      form.setValue("email", data.user.email);
      form.setValue("username", data.user.username);
      form.setValue("lastName", data.user.last_name);
      form.setValue("firstName", data.user.first_name);
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(postUser)}
            className="grid w-full grid-cols-2 gap-5"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="johndoe@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-2 flex w-full flex-col items-center justify-center gap-1.5">
              <Label className="w-full text-left text-sm">
                Upload Profile Picture
              </Label>
              <ImageUploader image={image} setImage={setImage} />
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
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
