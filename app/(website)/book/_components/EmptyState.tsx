import { Calendar } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export function EmptyState({
  title = "No times available on this day",
  message = "Try picking a different date above.",
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed bg-card/50 p-8 text-center">
      <Calendar className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{message}</p>
    </div>
  );
}
