import { useEffect, useState } from "react";

import { Loader2 } from "lucide-react";

import { columns } from "@/components/users/columns";
import DataTable from "@/components/users/data-table";
import { useAdminAccessToken } from "@/hooks/use-admin-access-token";
import { useGetAllUsersQuery } from "@/store/services/user";

const DEFAULT_USERS_START_DATE = "2024-01-01";

const getTodayInputDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, "0");
  const day = `${today.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const Users = () => {
  const accessToken = useAdminAccessToken();
  const [page, setPage] = useState<number>(1);
  const [defaultEndDate] = useState<string>(() => getTodayInputDate());
  const [startDate, setStartDate] = useState<string>(DEFAULT_USERS_START_DATE);
  const [endDate, setEndDate] = useState<string>(defaultEndDate);
  const [appliedStartDate, setAppliedStartDate] = useState<string>(
    DEFAULT_USERS_START_DATE
  );
  const [appliedEndDate, setAppliedEndDate] = useState<string>(defaultEndDate);
  const isDateFilterActive =
    appliedStartDate !== DEFAULT_USERS_START_DATE ||
    appliedEndDate !== defaultEndDate;
  const { data, isFetching, isLoading } = useGetAllUsersQuery(
    {
      token: accessToken,
      page,
      limit: 10,
      startDate: appliedStartDate,
      endDate: appliedEndDate,
    },
    {
      skip: !accessToken || accessToken === "",
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (data && page > 1 && data.results.length === 0) {
      setPage((currentPage) => Math.max(1, currentPage - 1));
    }
  }, [data, page]);

  const handleStartDateChange = (value: string) => {
    setStartDate(value);

    if (endDate && value && endDate < value) {
      setEndDate("");
    }
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
  };

  const applyDateFilters = () => {
    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);
    setPage(1);
  };

  const clearDateFilters = () => {
    setStartDate(DEFAULT_USERS_START_DATE);
    setEndDate(defaultEndDate);
    setAppliedStartDate(DEFAULT_USERS_START_DATE);
    setAppliedEndDate(defaultEndDate);
    setPage(1);
  };

  const goToNextPage = () => {
    setPage((currentPage) => currentPage + 1);
  };

  const goToPreviousPage = () => {
    setPage((currentPage) => Math.max(1, currentPage - 1));
  };

  return isLoading || !accessToken || accessToken === "" ? (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 className="size-10 animate-spin text-primary" />
    </div>
  ) : (
    <DataTable
      columns={columns}
      data={data?.results ?? []}
      isFetching={isFetching}
      page={page}
      pageSize={10}
      startDate={startDate}
      endDate={endDate}
      isDateFilterActive={isDateFilterActive}
      totalPages={data?.total_pages ?? 1}
      totalCount={data?.count ?? 0}
      onStartDateChange={handleStartDateChange}
      onEndDateChange={handleEndDateChange}
      onApplyDateFilters={applyDateFilters}
      onClearDateFilters={clearDateFilters}
      onNextPage={goToNextPage}
      onPreviousPage={goToPreviousPage}
    />
  );
};

export default Users;
