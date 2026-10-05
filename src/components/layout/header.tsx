"use client";

import { useSession, signOut } from "next-auth/react";
import { Menu, Search, User, LogOut } from "lucide-react";
import { useUIStore } from "@/store";
import { ModeToggle } from "@/components/mode-toggle";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { NotificationsDropdown } from "@/components/shared/notifications-dropdown";

export function Header() {
    const toggleSidebar = useUIStore((state) => state.toggleSidebar);
    const { data: session } = useSession();
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    className="-m-2.5 p-2.5 text-muted-foreground hover:text-foreground xl:hidden"
                    onClick={toggleSidebar}
                >
                    <span className="sr-only">Open sidebar</span>
                    <Menu className="h-5 w-5" aria-hidden="true" />
                </button>
            </div>

            <div className="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6">
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                    <NotificationsDropdown />
                    <ModeToggle />
                    <div className="h-6 w-px bg-border max-lg:hidden" aria-hidden="true" />
                    {session?.user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium hidden md:block">
                                {session.user.name} ({session.user.role.replace("RESEARCH_", "")})
                            </span>
                            <Button variant="ghost" size="icon" onClick={() => signOut({ callbackUrl: "/login" })} title="Logout">
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-x-4">
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                <User className="h-4 w-4 text-foreground" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
