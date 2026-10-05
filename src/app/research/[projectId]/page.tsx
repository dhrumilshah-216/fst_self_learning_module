import { db } from "@/lib/db";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatCard } from "@/components/shared/stat-card";
import { AddMemberForm } from "@/components/shared/add-member-form";
import { Users, FileText, FlaskConical, CheckSquare, Settings } from "lucide-react";
import { LiteratureTab } from "@/components/project/literature-tab";
import { ExperimentTab } from "@/components/project/experiment-tab";
import { TaskTab } from "@/components/project/task-tab";
import { TimelineTab } from "@/components/project/timeline-tab";
import { Metadata } from "next";

export async function generateMetadata(props: { params: Promise<{ projectId: string }> }): Promise<Metadata> {
    const params = await props.params;
    const project = await db.researchProject.findUnique({ where: { id: params.projectId } });
    if (!project) return { title: "Project Not Found" };

    return {
        title: project.title,
        description: project.description,
        openGraph: {
            title: project.title,
            description: project.description,
            images: [`/api/og?title=${encodeURIComponent(project.title)}&area=${encodeURIComponent(project.researchArea)}&status=${project.status}`],
        }
    };
}

export default async function ProjectDetailPage(props: { params: Promise<{ projectId: string }> }) {
    const params = await props.params;
    const session = await auth();

    if (!session?.user) return null;

    const project = await db.researchProject.findUnique({
        where: { id: params.projectId },
        include: {
            _count: {
                select: { members: true, papers: true, tasks: true, questions: true }
            }
        }
    });

    if (!project) notFound();

    return (
        <div className="space-y-6 flex flex-col h-full min-h-[calc(100vh-8rem)]">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">{project.title}</h1>
                        <StatusBadge status={project.status} className="mt-1" />
                    </div>
                    <p className="text-muted-foreground max-w-3xl">{project.description}</p>
                </div>
                <div className="flex items-center gap-2">
                    {(session.user.role === 'RESEARCH_LEAD' || session.user.role === 'SUPERVISOR') && (
                        <>
                            <Button variant="outline"><Settings className="w-4 h-4 mr-2" /> Settings</Button>
                            <Button>Edit Project</Button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4 my-6">
                <StatCard title="Team Members" value={project._count.members} icon={Users} />
                <StatCard title="Literature" value={project._count.papers} icon={FileText} />
                <StatCard title="Questions" value={project._count.questions} icon={FlaskConical} />
                <StatCard title="Open Tasks" value={project._count.tasks} icon={CheckSquare} />
            </div>

            <Tabs defaultValue="overview" className="flex-1 flex flex-col">
                <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden border-b rounded-none bg-transparent h-12 p-0 space-x-6">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0">Overview</TabsTrigger>
                    <TabsTrigger value="questions" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0">Research Questions</TabsTrigger>
                    <TabsTrigger value="literature" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0">Literature</TabsTrigger>
                    <TabsTrigger value="experiments" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0">Experiments</TabsTrigger>
                    <TabsTrigger value="tasks" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0">Tasks</TabsTrigger>
                    <TabsTrigger value="timeline" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0">Timeline</TabsTrigger>
                </TabsList>

                <div className="flex-1 mt-6">
                    <TabsContent value="overview" className="mt-0 h-full flex flex-col">
                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="md:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm">
                                <h3 className="text-lg font-semibold mb-4">Project Overview & Area</h3>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    <strong>Research Area:</strong> {project.researchArea}
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    {project.description}
                                </p>
                            </div>
                            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                                <h3 className="text-lg font-semibold mb-4">Timeline</h3>
                                <div className="space-y-3 pb-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Created</span>
                                        <span className="font-medium">{new Intl.DateTimeFormat('en-US').format(project.createdAt)}</span>
                                    </div>
                                    {project.startDate && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Started</span>
                                            <span className="font-medium">{new Intl.DateTimeFormat('en-US').format(project.startDate)}</span>
                                        </div>
                                    )}
                                    {project.expectedEndDate && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Expected End</span>
                                            <span className="font-medium">{new Intl.DateTimeFormat('en-US').format(project.expectedEndDate)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {(session.user.role === 'RESEARCH_LEAD' || session.user.role === 'SUPERVISOR') && (
                            <AddMemberForm projectId={project.id} />
                        )}
                    </TabsContent>

                    <TabsContent value="questions" className="mt-0 h-full">
                        <EmptyState title="No Research Questions" description="Define the core questions this project aims to answer." actionLabel="Add Question" />
                    </TabsContent>

                    <TabsContent value="literature" className="mt-0 h-full">
                        <LiteratureTab projectId={project.id} />
                    </TabsContent>

                    <TabsContent value="experiments" className="mt-0 h-full">
                        <ExperimentTab projectId={project.id} />
                    </TabsContent>

                    <TabsContent value="tasks" className="mt-0 h-full">
                        <TaskTab projectId={project.id} />
                    </TabsContent>

                    <TabsContent value="timeline" className="mt-0 h-full">
                        <TimelineTab projectId={project.id} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
