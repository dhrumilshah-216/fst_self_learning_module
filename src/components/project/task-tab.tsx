import { db } from "@/lib/db";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { CheckSquare } from "lucide-react";

export async function TaskTab({ projectId }: { projectId: string }) {
    const tasks = await db.task.findMany({
        where: { projectId },
        include: { assignee: { select: { name: true } } },
        orderBy: { createdAt: 'desc' }
    });

    if (tasks.length === 0) {
        return (
            <EmptyState
                title="No Open Tasks"
                description="Keep track of your project to-dos and assignments."
                actionLabel="Create Task"
            />
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Tasks</h3>
                <Button>Add Task</Button>
            </div>
            <div className="grid gap-3">
                {tasks.map((task) => (
                    <div key={task.id} className="p-4 bg-card border rounded-lg shadow-sm flex items-center justify-between gap-4">
                        <div>
                            <h4 className={`font-medium ${task.status === "DONE" ? "line-through text-muted-foreground" : ""}`}>{task.title}</h4>
                            {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                            <span className={`px-2 py-1 rounded border ${task.priority === 'HIGH' ? 'border-rose-500 text-rose-500' : 'border-border'}`}>{task.priority}</span>
                            <span className="px-2 py-1 rounded bg-muted">{task.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
