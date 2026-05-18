interface Props {
  value: number;
  className?: string;
  color?: string;
}

export function ProgressBar({ value, className = '', color = 'bg-brand-500' }: Props) {
  return (
    <div className={`h-1.5 bg-white/10 rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
