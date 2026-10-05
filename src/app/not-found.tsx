import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center p-4 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
                <FileQuestion className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-2xl font-semibold tracking-tight">System Entity Not Found</h2>
            <p className="mb-6 text-muted-foreground w-full max-w-md">
                We couldn't find the resource you were looking for. The project, experiment, or record may have been deleted, or you might not have access to it.
            </p>
            <Link href="/dashboard">
                <Button>Return to Dashboard</Button>
            </Link>
        </div>
    );
}
