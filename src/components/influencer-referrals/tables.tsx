import { Ban, BarChart3, Eye, MoreVertical, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  EmptyState,
  LoadingState,
  Pagination,
  StatusPill,
  ValidPill,
} from "./shared";
import {
  formatDate,
  getInfluencerName,
  getInfluencerUserId,
  isReferralValid,
} from "./utils";

export const InfluencersTable = ({
  data,
  loading,
  page,
  onPageChange,
  onView,
  onEdit,
  onDeactivate,
  onAnalytics,
  onOpen,
}: {
  data?: PaginatedResponse<Influencer>;
  loading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDeactivate: (id: number, name: string) => void;
  onAnalytics: (id: number) => void;
  onOpen: (id: number) => void;
}) => {
  if (loading) {
    return <LoadingState />;
  }

  if (!data?.results.length) {
    return <EmptyState message="No influencers found." />;
  }

  return (
    <>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Display name</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Social platform</TableHead>
              <TableHead>Social handle</TableHead>
              <TableHead>Active status</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead className="w-20 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.results.map((influencer) => (
              <TableRow
                key={influencer.id}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => onOpen(influencer.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onOpen(influencer.id);
                  }
                }}
              >
                <TableCell className="font-medium">
                  {influencer.display_name}
                </TableCell>
                <TableCell>{getInfluencerUserId(influencer)}</TableCell>
                <TableCell className="capitalize">
                  {influencer.social_platform}
                </TableCell>
                <TableCell>{influencer.social_handle}</TableCell>
                <TableCell>
                  <StatusPill active={influencer.is_active} />
                </TableCell>
                <TableCell>{formatDate(influencer.created_at)}</TableCell>
                <TableCell
                  className="text-right"
                  onClick={(event) => event.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Open actions for ${influencer.display_name}`}
                      >
                        <MoreVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={() => onView(influencer.id)}>
                        <Eye />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(influencer.id)}>
                        <Pencil />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onAnalytics(influencer.id)}
                      >
                        <BarChart3 />
                        Analytics
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() =>
                          onDeactivate(influencer.id, influencer.display_name)
                        }
                      >
                        <Ban />
                        Deactivate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination page={page} total={data.count} onPageChange={onPageChange} />
    </>
  );
};

export const ReferralCodesTable = ({
  data,
  loading,
  page,
  onPageChange,
  onOpen,
  onEdit,
  onDeactivate,
}: {
  data?: PaginatedResponse<ReferralCode>;
  loading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  onOpen: (id: number) => void;
  onEdit: (id: number) => void;
  onDeactivate: (id: number, code: string) => void;
}) => {
  if (loading) {
    return <LoadingState />;
  }

  if (!data?.results.length) {
    return <EmptyState message="No referral codes found." />;
  }

  return (
    <>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Influencer name</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Redemptions</TableHead>
              <TableHead>Max</TableHead>
              <TableHead>Valid from</TableHead>
              <TableHead>Valid until</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Valid</TableHead>
              <TableHead>Invalid reason</TableHead>
              <TableHead className="w-20 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.results.map((referral) => (
              <TableRow
                key={referral.id}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => onOpen(referral.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onOpen(referral.id);
                  }
                }}
              >
                <TableCell>{referral.id}</TableCell>
                <TableCell className="font-medium">{referral.code}</TableCell>
                <TableCell>{getInfluencerName(referral)}</TableCell>
                <TableCell>{referral.discount_percentage}%</TableCell>
                <TableCell>{referral.current_redemptions ?? 0}</TableCell>
                <TableCell>{referral.max_redemptions}</TableCell>
                <TableCell>{formatDate(referral.valid_from)}</TableCell>
                <TableCell>{formatDate(referral.valid_until)}</TableCell>
                <TableCell>
                  <StatusPill active={referral.is_active} />
                </TableCell>
                <TableCell>
                  <ValidPill valid={isReferralValid(referral)} />
                </TableCell>
                <TableCell className="max-w-56 whitespace-normal">
                  {referral.invalid_reason || "-"}
                </TableCell>
                <TableCell
                  className="text-right"
                  onClick={(event) => event.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Open actions for referral code ${referral.code}`}
                      >
                        <MoreVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={() => onEdit(referral.id)}>
                        <Pencil />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDeactivate(referral.id, referral.code)}
                      >
                        <Ban />
                        Deactivate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination page={page} total={data.count} onPageChange={onPageChange} />
    </>
  );
};
