import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function LoadingState({ className }: { className?: string }) {
    return (
        <div className={cn("flex h-[200px] w-full flex-col items-center justify-center gap-4 rounded-xl border border-border border-dashed bg-card/50", className)}>
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">Loading...</p>
        </div>
    );
}
