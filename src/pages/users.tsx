import { Loader2 } from "lucide-react";

import { columns } from "@/components/users/columns";
import DataTable from "@/components/users/data-table";
import { useGetAllUsersQuery } from "@/store/services/user";

const Users = () => {
  const { data, isLoading } = useGetAllUsersQuery({});

  return isLoading ? (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 className="size-10 animate-spin text-primary" />
    </div>
  ) : (
    <DataTable columns={columns} data={data!} />
  );
};

export default Users;
