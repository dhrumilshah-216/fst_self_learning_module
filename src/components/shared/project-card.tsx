import { cn } from "@/lib/utils";
import Link from "next/link";
import { Users, FileText, FlaskConical, Calendar } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";

export interface ProjectCardProps {
    id: string;
    title: string;
    description: string;
    status: string;
    updatedAt: string;
    stats: {
        members: number;
        literature: number;
        experiments: number;
    };
    className?: string;
}

export function ProjectCard({ id, title, description, status, updatedAt, stats, className }: ProjectCardProps) {
    return (
        <Link
            href={`/research/${id}`}
            className={cn(
                "group flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md",
                className
            )}
        >
            <div>
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg leading-none tracking-tight group-hover:text-primary transition-colors line-clamp-1">{title}</h3>
                    <StatusBadge status={status} />
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{description}</p>
            </div>

            <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    <span>{stats.members}</span>
                </div>
                <div className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    <span>{stats.literature}</span>
                </div>
                <div className="flex items-center gap-1">
                    <FlaskConical className="h-3.5 w-3.5" />
                    <span>{stats.experiments}</span>
                </div>

                <div className="ml-auto flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{updatedAt}</span>
                </div>
            </div>
        </Link>
    );
}
