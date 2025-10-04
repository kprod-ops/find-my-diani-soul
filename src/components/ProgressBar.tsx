interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full max-w-sm mx-auto mb-6">
      <div className="flex justify-between text-sm text-muted-foreground mb-2">
        <span>Round {current} of {total}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-ocean transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
