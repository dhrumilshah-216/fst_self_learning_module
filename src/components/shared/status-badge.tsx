import { cn } from "@/lib/utils";

export type ProjectStatus = "active" | "planning" | "completed" | "paused";

interface StatusBadgeProps {
    status: ProjectStatus | string;
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const normalizedStatus = status.toLowerCase();

    let styles = "bg-muted text-muted-foreground"; // default

    if (normalizedStatus === "active") {
        styles = "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-400";
    } else if (normalizedStatus === "planning") {
        styles = "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400";
    } else if (normalizedStatus === "completed") {
        styles = "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400";
    } else if (normalizedStatus === "paused") {
        styles = "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400";
    } else if (normalizedStatus === "pending") {
        styles = "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400";
    } else if (normalizedStatus === "success") {
        styles = "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400";
    } else if (normalizedStatus === "failed" || normalizedStatus === "error") {
        styles = "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-400";
    }

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold w-fit",
                styles,
                className
            )}
        >
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}
