import { useEffect, useState } from "react";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Loader2 } from "lucide-react";

import { columns } from "@/components/users/columns";
import DataTable from "@/components/users/data-table";
import { useGetAllUsersQuery } from "@/store/services/user";

const Users = () => {
  const { getIdToken } = useKindeAuth();
  const [accessToken, setAccessToken] = useState<string>("");
  const { data, isLoading } = useGetAllUsersQuery(
    {},
    {
      skip: !accessToken || accessToken === "",
      refetchOnMountOrArgChange: true,
    }
  );

  const handleToken = async () => {
    let token: string | undefined = "";

    if (getIdToken) {
      token = await getIdToken();
    }

    if (token) {
      setAccessToken(token);
    }
  };

  useEffect(() => {
    handleToken();
  }, [getIdToken]);

  return isLoading || !accessToken || accessToken === "" ? (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 className="size-10 animate-spin text-primary" />
    </div>
  ) : (
    <DataTable columns={columns} data={data!} />
  );
};

export default Users;
