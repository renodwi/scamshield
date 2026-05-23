export function ConfidenceMeter({ value }: { value: number }) {
  const clampedValue = Math.max(0, Math.min(100, Math.round(value)));
  const color =
    clampedValue >= 80
      ? "#dc2626"
      : clampedValue >= 65
        ? "#ea580c"
        : clampedValue >= 40
          ? "#ca8a04"
          : "#059669";

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-normal text-slate-500">Persentase Penipuan</p>
        <p className="text-sm font-extrabold text-slate-950">{clampedValue}%</p>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100" aria-label={`Persentase Penipuan ${clampedValue}%`}>
        <div className="h-full rounded-full transition-all" style={{ width: `${clampedValue}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
