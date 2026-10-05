"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Application caught error:", error);
    }, [error]);

    return (
        <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center p-4 text-center">
            <div className="rounded-full bg-destructive/10 p-3 mb-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="mb-2 text-2xl font-semibold tracking-tight">Something went wrong!</h2>
            <p className="mb-6 text-muted-foreground w-full max-w-md">
                An unexpected error occurred. This has been logged and we're looking into it. Please try again.
            </p>
            <div className="flex items-center gap-4">
                <Button onClick={() => reset()}>Try again</Button>
                <Link href="/dashboard">
                    <Button variant="outline">Return to Dashboard</Button>
                </Link>
            </div>
        </div>
    );
}
