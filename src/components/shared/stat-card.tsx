import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

export function StatCard({ title, value, icon: Icon, description, trend, className }: StatCardProps) {
    return (
        <div className={cn("rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6", className)}>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{title}</h3>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2">
                <div className="text-2xl font-bold">{value}</div>
                {(description || trend) && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center">
                        {trend && (
                            <span className={cn("mr-1 font-medium", trend.isPositive ? "text-emerald-500" : "text-rose-500")}>
                                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                            </span>
                        )}
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}
