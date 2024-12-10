import { columns } from "@/components/users/columns";
import DataTable from "@/components/users/data-table";
import { users } from "@/lib/constants";

const Users = () => {
  return <DataTable columns={columns} data={users} />;
};

export default Users;
