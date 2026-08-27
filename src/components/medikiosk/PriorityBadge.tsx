import { cn } from "@/lib/utils";
import { PRIORITY_META, type Priority } from "@/lib/medikiosk/types";

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  const meta = PRIORITY_META[priority];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold", meta.badge, className)}>
      <span className={cn("h-2 w-2 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}

export function PriorityDot({ priority, className }: { priority: Priority; className?: string }) {
  return <span className={cn("h-2.5 w-2.5 rounded-full", PRIORITY_META[priority].dot, className)} />;
}
