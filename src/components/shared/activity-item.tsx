import { cn } from "@/lib/utils";
import { FolderPlus, FileText, FlaskConical, CheckCircle2, UserPlus } from "lucide-react";

export type ActivityType = "project" | "paper" | "experiment" | "task" | "review";

interface ActivityItemProps {
    type: ActivityType;
    title: string;
    description: string;
    timestamp: string;
    user: string;
    className?: string;
}

export function ActivityItem({ type, title, description, timestamp, user, className }: ActivityItemProps) {

    let Icon = FolderPlus;
    let iconBg = "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400";

    if (type === "paper") {
        Icon = FileText;
        iconBg = "bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400";
    } else if (type === "experiment") {
        Icon = FlaskConical;
        iconBg = "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400";
    } else if (type === "task") {
        Icon = CheckCircle2;
        iconBg = "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400";
    } else if (type === "review") {
        Icon = UserPlus;
        iconBg = "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400";
    }

    return (
        <div className={cn("relative flex gap-x-4", className)}>
            <div className={cn("relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full", iconBg)}>
                <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-border bg-card/50">
                <div className="flex justify-between gap-x-4">
                    <div className="py-0.5 text-sm leading-5">
                        <span className="font-semibold text-foreground mr-1">{user}</span>
                        <span className="text-muted-foreground">{title}</span>
                    </div>
                    <time dateTime={timestamp} className="flex-none py-0.5 text-xs text-muted-foreground">
                        {timestamp}
                    </time>
                </div>
                <p className="text-sm text-foreground mt-1 line-clamp-2">{description}</p>
            </div>
        </div>
    );
}
