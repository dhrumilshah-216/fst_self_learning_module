import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { ProjectCard } from "@/components/shared/project-card";
import { Folder, FileText, FlaskConical, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export default async function DashboardPage() {
    const session = await auth();

    // Since middleware protects this route, session should exist
    if (!session?.user) return null;

    // Retrieve projects associated with the user
    const userProjects = await db.researchProject.findMany({
        where: {
            OR: [
                { createdById: session.user.id },
                { members: { some: { userId: session.user.id } } }
            ]
        },
        include: {
            _count: {
                select: { members: true, papers: true, tasks: true }
            }
        },
        orderBy: { updatedAt: 'desc' },
        take: 4
    });

    // Calculate some stats (realistically you'd want optimized counts)
    const totalProjects = await db.researchProject.count({
        where: {
            OR: [
                { createdById: session.user.id },
                { members: { some: { userId: session.user.id } } }
            ]
        }
    });

    return (
        <div className="space-y-6">
            <PageHeader
                title={`Welcome back, ${session.user.name || 'Researcher'}`}
                description="Overview of your research projects and recent activities."
                actions={
                    (session.user.role === 'RESEARCH_LEAD' || session.user.role === 'SUPERVISOR') ? (
                        <Link href="/research/new">
                            <Button>New Project</Button>
                        </Link>
                    ) : null
                }
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Active Projects" value={totalProjects} icon={Folder} />
                <StatCard title="Literature Papers" value="-" icon={FileText} description="Coming soon" />
                <StatCard title="Total Experiments" value="-" icon={FlaskConical} description="Coming soon" />
                <StatCard title="Pending Tasks" value="-" icon={CheckSquare} description="Coming soon" />
            </div>

            <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-12 mt-6">
                <div className="md:col-span-4 lg:col-span-8 flex flex-col gap-6">
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold tracking-tight">Your Projects</h2>
                            <Link href="/research">
                                <Button variant="ghost" size="sm">View all</Button>
                            </Link>
                        </div>

                        {userProjects.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2">
                                {userProjects.map(project => (
                                    <ProjectCard
                                        key={project.id}
                                        id={project.id}
                                        title={project.title}
                                        description={project.description}
                                        status={project.status}
                                        updatedAt={new Intl.DateTimeFormat('en-US').format(project.updatedAt)}
                                        stats={{
                                            members: project._count.members,
                                            literature: project._count.papers,
                                            experiments: 0 // Defer logic for experiments
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 flex flex-col items-center text-muted-foreground border border-dashed rounded-lg">
                                <Folder className="h-8 w-8 mb-2 opacity-50" />
                                <p>No projects found.</p>
                                {(session.user.role === 'RESEARCH_LEAD' || session.user.role === 'SUPERVISOR') && (
                                    <Link href="/research/new" className="mt-4">
                                        <Button variant="outline">Create your first project</Button>
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="md:col-span-3 lg:col-span-4 flex flex-col gap-6">
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex-1">
                        <h2 className="text-lg font-semibold tracking-tight mb-4">Recent Activity</h2>
                        <div className="space-y-6 flex flex-col items-center justify-center text-center h-[200px] text-muted-foreground">
                            <p className="text-sm">Activity feed will be powered by real data in the next stage.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
