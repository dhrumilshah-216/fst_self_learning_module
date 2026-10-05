"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-background">
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
                <Header />
                <main className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-6 lg:p-8">
                    <div className="mx-auto max-w-7xl h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
