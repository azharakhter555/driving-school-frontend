interface LoadingStateProps {
  /** Number of skeleton tiles to show (default: 8) */
  count?: number;
}

export function LoadingState({ count = 8 }: LoadingStateProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-10 animate-pulse rounded-xl bg-muted" />
      ))}
    </div>
  );
}
