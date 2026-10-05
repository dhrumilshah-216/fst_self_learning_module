import { cn } from "@/lib/utils";
import { FolderSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export function EmptyState({ title, description, actionLabel, onAction, className }: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center rounded-xl border border-border border-dashed p-12 text-center bg-card/50", className)}>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                <FolderSearch className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm mb-6 pb-2">
                {description}
            </p>
            {actionLabel && (
                <Button onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
