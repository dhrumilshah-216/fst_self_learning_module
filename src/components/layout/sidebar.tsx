"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FolderIcon,
    BookOpen,
    FlaskConical,
    CheckSquare,
    FileText,
    ActivitySquare,
    X
} from "lucide-react";
import { useUIStore } from "@/store";
import { Button } from "@/components/ui/button";

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Research', href: '/research', icon: FolderIcon },
    { name: 'Literature', href: '/literature', icon: BookOpen },
    { name: 'Experiments', href: '/experiments', icon: FlaskConical },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Findings', href: '/findings', icon: FileText },
    { name: 'Activity', href: '/activity', icon: ActivitySquare },
];

export function Sidebar() {
    const pathname = usePathname();
    const { sidebarOpen, setSidebarOpen } = useUIStore();

    return (
        <>
            {/* Mobile backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm xl:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r border-border bg-card transition-transform duration-300 xl:static xl:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full hidden xl:flex xl:w-0 xl:overflow-hidden xl:border-none"
                )}
            >
                <div className="flex h-16 items-center justify-between px-6 xl:justify-start">
                    <h1 className="text-xl font-bold tracking-tight text-primary">ResearchFlow</h1>
                    <Button variant="ghost" size="icon" className="xl:hidden" onClick={() => setSidebarOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    "group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                                        isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                                    )}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
}
