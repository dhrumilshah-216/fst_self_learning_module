import { db } from "@/lib/db";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { ActivityItem } from "@/components/shared/activity-item";
import { Settings } from "lucide-react";
import Link from "next/link";
import { CommentsSection } from "@/components/project/comments-section";
import { ReviewSection } from "@/components/project/review-section";

export default async function ExperimentPage(props: { params: Promise<{ projectId: string, experimentId: string }> }) {
    const params = await props.params;
    const session = await auth();

    if (!session?.user) return null;

    const experiment = await db.experiment.findUnique({
        where: { id: params.experimentId },
        include: {
            researcher: { select: { name: true } },
            results: true,
            comments: {
                include: { author: { select: { name: true } } },
                orderBy: { createdAt: 'asc' }
            },
            reviews: {
                include: { reviewer: { select: { name: true } } },
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!experiment || experiment.projectId !== params.projectId) notFound();

    const isSupervisor = session.user.role === 'SUPERVISOR';
    // Check explicit project supervisor role
    const pm = await db.projectMember.findUnique({ where: { projectId_userId: { projectId: params.projectId, userId: session.user.id } } });
    const hasReviewRights = isSupervisor && pm?.role === 'SUPERVISOR';

    // Get recent experiment specific activity
    const logs = await db.activityLog.findMany({
        where: { projectId: params.projectId, entityId: params.experimentId },
        include: { actor: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    return (
        <div className="space-y-6 flex flex-col h-full">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Link href={`/research/${params.projectId}`} className="text-muted-foreground hover:text-foreground hover:underline text-sm mr-2">
                            ← Back to Project
                        </Link>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">{experiment.title}</h1>
                        <StatusBadge status={experiment.status} className="mt-1" />
                    </div>
                    <p className="text-muted-foreground max-w-3xl">{experiment.objective}</p>
                </div>
                <div className="flex items-center gap-2">
                    {(hasReviewRights || session.user.role === 'RESEARCH_LEAD') && (
                        <Button variant="outline"><Settings className="w-4 h-4 mr-2" /> Settings</Button>
                    )}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mt-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">Methodology</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium text-sm text-foreground">Method & Technique</h4>
                                <p className="text-sm text-muted-foreground">{experiment.method}</p>
                            </div>
                            {experiment.dataset && (
                                <div>
                                    <h4 className="font-medium text-sm text-foreground">Dataset</h4>
                                    <p className="text-sm text-muted-foreground">{experiment.dataset}</p>
                                </div>
                            )}
                            {experiment.parameters && (
                                <div>
                                    <h4 className="font-medium text-sm text-foreground">Parameters</h4>
                                    <p className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded-md mt-1">
                                        {experiment.parameters}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Results</h3>
                            {experiment.researcherId === session.user.id && (
                                <Button variant="outline" size="sm">Add Metric</Button>
                            )}
                        </div>

                        {experiment.results.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No metrics recorded yet.</p>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {experiment.results.map(res => (
                                    <div key={res.id} className="p-4 border rounded-lg bg-background text-center">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{res.metricName}</p>
                                        <p className="text-2xl font-bold">{res.metricValue}{res.unit}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <CommentsSection
                            projectId={params.projectId}
                            experimentId={params.experimentId}
                            comments={experiment.comments}
                        />
                    </div>
                </div>

                <div className="md:col-span-1 space-y-6">
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <ReviewSection
                            projectId={params.projectId}
                            experimentId={params.experimentId}
                            reviews={experiment.reviews}
                            isSupervisor={hasReviewRights}
                        />
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">Meta Information</h3>
                        <div className="space-y-4 text-sm">
                            <div>
                                <span className="text-muted-foreground block">Lead Researcher</span>
                                <span className="font-medium">{experiment.researcher?.name || "Unassigned"}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block">Created</span>
                                <span className="font-medium">{new Date(experiment.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block">Last Updated</span>
                                <span className="font-medium">{new Date(experiment.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">Experiment Activity</h3>
                        <div className="space-y-6 relative max-h-[400px] overflow-y-auto">
                            {logs.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No activity recorded natively yet.</p>
                            ) : (
                                logs.map((log, index) => (
                                    <div key={log.id} className="relative">
                                        {index !== logs.length - 1 && (
                                            <span className="absolute left-5 top-10 -ml-px h-full w-0.5 bg-border" aria-hidden="true" />
                                        )}
                                        <ActivityItem
                                            type="experiment"
                                            title={log.action}
                                            description={log.entityTitle || " "}
                                            timestamp={new Date(log.createdAt).toLocaleDateString()}
                                            user={log.actor.name}
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
