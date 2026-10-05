import { db } from "@/lib/db";
import { EmptyState } from "@/components/shared/empty-state";
import { ActivityItem, ActivityType } from "@/components/shared/activity-item";

export async function TimelineTab({ projectId }: { projectId: string }) {
    const logs = await db.activityLog.findMany({
        where: { projectId },
        include: { actor: { select: { name: true } } },
        orderBy: { createdAt: 'desc' }
    });

    if (logs.length === 0) {
        return (
            <EmptyState
                title="Timeline Empty"
                description="Your timeline will populate as activity occurs."
            />
        );
    }

    return (
        <div className="space-y-6 pt-4 max-w-3xl ml-4">
            {logs.map((log, index) => {
                let type: ActivityType = "project";
                if (log.entityType === "PAPER") type = "paper";
                if (log.entityType === "EXPERIMENT") type = "experiment";
                if (log.entityType === "TASK") type = "task";

                return (
                    <div key={log.id} className="relative">
                        {index !== logs.length - 1 && (
                            <span className="absolute left-5 top-10 -ml-px h-full w-0.5 bg-border" aria-hidden="true" />
                        )}
                        <ActivityItem
                            type={type}
                            title={log.action}
                            description={log.entityTitle || " "}
                            timestamp={new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(log.createdAt)}
                            user={log.actor?.name || 'Unknown'}
                        />
                    </div>
                )
            })}
        </div>
    );
}
