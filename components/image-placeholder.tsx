type ImagePlaceholderProps = {
  label: string;
  className?: string;
  compact?: boolean;
};

export function ImagePlaceholder({
  label,
  className = "aspect-[16/9]",
  compact = false,
}: ImagePlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`flex w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-100 text-center ${className}`}
    >
      <div className={`px-4 ${compact ? "py-4" : "py-8"}`}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          Image / mockup needed
        </p>
        <p
          className={`mx-auto mt-2 max-w-xs text-balance text-slate-500 ${
            compact ? "text-xs" : "text-sm font-medium"
          }`}
        >
          {label}
        </p>
      </div>
    </div>
  );
}
