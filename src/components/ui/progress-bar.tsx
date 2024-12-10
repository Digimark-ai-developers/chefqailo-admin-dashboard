const ProgressBar = ({ width }: { width: number }) => {
  return (
    <div className="relative h-1 w-full overflow-hidden rounded-full bg-gray-300 dark:bg-gray-700">
      <div
        className={`absolute h-full rounded-full bg-primary`}
        style={{
          width: `${Math.round(width)}%`,
        }}
      />
    </div>
  );
};

export default ProgressBar;
