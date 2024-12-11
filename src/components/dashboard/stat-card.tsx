import { cn, formatNumber } from "@/lib/utils";

interface CardProps {
  card: Card;
  clickEvent: () => void;
  selectedStat: "users" | "monthly_sales_amount" | "total_sales";
}

// bg-[hsl(var(--chart-1))]/20 text-[hsl(var(--chart-1))]
// bg-[hsl(var(--chart-2))]/20 text-[hsl(var(--chart-2))]
// bg-[hsl(var(--chart-3))]/20 text-[hsl(var(--chart-3))]

const StatCard = ({ card, selectedStat, clickEvent }: CardProps) => {
  return (
    <div
      className={cn(
        "col-span-1 flex h-fit w-full cursor-pointer flex-col items-center justify-center gap-2.5 rounded-lg p-2.5 transition-colors",
        {
          "bg-card shadow-md": selectedStat === card.tag,
          "bg-transparent": selectedStat !== card.tag,
        }
      )}
      onClick={clickEvent}
    >
      <div className="flex w-full items-start justify-start gap-1.5">
        <span className="flex-1 text-left text-sm font-semibold text-gray-500">
          {card.name}
        </span>
        <div
          className={`size-10 rounded-full bg-[${card.color}]/20 p-2 text-[${card.color}]`}
        >
          <card.icon className="size-full" />
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center">
        <span className="w-full text-left text-3xl font-bold">
          {formatNumber(card.value)}
        </span>
        <span className="w-full text-left text-xs">
          <span
            className={cn("font-semibold", {
              "text-green-500": card.increase,
              "text-red-500": !card.increase,
            })}
          >
            {card.increase ? "+" : "-"}
            {card.rate}%
          </span>
          &nbsp;from last month
        </span>
      </div>
    </div>
  );
};

export default StatCard;
