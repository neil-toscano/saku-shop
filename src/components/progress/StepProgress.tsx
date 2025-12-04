interface StepProgressProps {
  current: number;
  total: number;
}

export const StepProgress = ({ current, total }: StepProgressProps) => {
  const percentage = (current / total) * 100;

  return (
    <div className="mt-1 mb-5">
      {/* Texto del paso */}
      <div className="flex items-center gap-3 mb-1">
        <span className="text-sm font-semibold text-gray-700">
          Paso {current} de {total}
        </span>
      </div>

      {/* Barra */}
      <div className="w-full bg-gray-200 h-1.5 rounded-full">
        <div
          className="bg-sky-500 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};
