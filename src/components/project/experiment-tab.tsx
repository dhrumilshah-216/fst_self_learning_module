import { db } from "@/lib/db";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { FlaskConical } from "lucide-react";
import Link from "next/link";

export async function ExperimentTab({ projectId }: { projectId: string }) {
    const experiments = await db.experiment.findMany({
        where: { projectId },
        include: { researcher: { select: { name: true } } },
        orderBy: { createdAt: 'desc' }
    });

    if (experiments.length === 0) {
        return (
            <EmptyState
                title="No Experiments Configured"
                description="Define and begin your first research experiment."
                actionLabel="Create Experiment"
            />
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Experiments</h3>
                <Button>New Experiment</Button>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {experiments.map((exp) => (
                    <Link key={exp.id} href={`/research/${projectId}/experiments/${exp.id}`}>
                        <div className="p-4 bg-card border hover:border-primary/50 transition-colors rounded-lg shadow-sm flex flex-col gap-2 h-full">
                            <div className="flex justify-between items-start">
                                <h4 className="font-medium text-lg line-clamp-1">{exp.title}</h4>
                                <span className="bg-muted text-xs px-2 py-1 rounded-full">{exp.status}</span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{exp.objective}</p>
                            <div className="mt-auto pt-4 text-xs text-muted-foreground">
                                <p>Lead: {exp.researcher?.name || 'Unassigned'}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
