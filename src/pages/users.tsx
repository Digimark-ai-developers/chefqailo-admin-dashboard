import { useEffect, useState } from "react";

import { Loader2 } from "lucide-react";

import { columns } from "@/components/users/columns";
import DataTable from "@/components/users/data-table";
import { getAdminAccessToken } from "@/lib/admin-auth";
import { useGetAllUsersQuery } from "@/store/services/user";

const Users = () => {
  const [accessToken, setAccessToken] = useState<string>("");
  const { data, isLoading } = useGetAllUsersQuery(accessToken, {
    skip: !accessToken || accessToken === "",
    refetchOnMountOrArgChange: true,
  });

  const handleToken = async () => {
    const token = getAdminAccessToken();

    if (token) {
      setAccessToken(token);
    }
  };

  useEffect(() => {
    handleToken();
  }, []);

  return isLoading || !accessToken || accessToken === "" ? (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 className="size-10 animate-spin text-primary" />
    </div>
  ) : (
    <DataTable columns={columns} data={data!} />
  );
};

export default Users;
