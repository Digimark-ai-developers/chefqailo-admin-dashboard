import { cn } from "@/lib/utils";

const ConicGradient = ({
  size,
  progress,
}: {
  size: string;
  progress: number;
}) => {
  return (
    <div
      className={cn("rounded-full bg-transparent", size)}
      style={{
        background: `conic-gradient(#F97316 ${progress}%, #696969 0)`,
      }}
    />
  );
};

export default ConicGradient;
