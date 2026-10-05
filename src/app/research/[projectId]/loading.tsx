import { Skeleton } from "@/components/ui/skeleton"

export default function ProjectLoading() {
    return (
        <div className="space-y-6 h-full">
            <div className="flex justify-between items-start">
                <div className="space-y-3">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-5 w-[600px] max-w-full" />
                </div>
                <Skeleton className="h-10 w-24" />
            </div>

            <div className="grid gap-4 md:grid-cols-4 my-6">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-28 w-full rounded-xl" />
                ))}
            </div>

            <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
    )
}
