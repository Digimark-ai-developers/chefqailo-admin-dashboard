const ProgressBar = ({ width }: { width: number }) => {
  return (
    <div className="relative h-5 w-full overflow-hidden rounded-full bg-gray-300 dark:bg-gray-700">
      <div
        className={`absolute flex h-full items-center justify-center rounded-full bg-primary`}
        style={{
          width: `${Math.round(width)}%`,
        }}
      >
        <p className="w-full px-2.5 text-right text-xs">{width}%</p>
      </div>
    </div>
  );
};

export default ProgressBar;
