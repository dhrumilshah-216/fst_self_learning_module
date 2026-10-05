"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Since base radix ui dropdown isn't exactly matching shadcn in our dummy build, I'll build a simplified absolute popup

export function NotificationsDropdown() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const loadNotifications = async () => {
        try {
            const res = await fetch("/api/notifications");
            if (res.ok) setNotifications(await res.json());
        } catch (e) { }
    };

    useEffect(() => {
        loadNotifications();
        const interval = setInterval(loadNotifications, 30000); // 30s poll
        return () => clearInterval(interval);
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const markRead = async (id: string, link: string | null) => {
        await fetch("/api/notifications", {
            method: "POST",
            body: JSON.stringify({ id }),
            headers: { "Content-Type": "application/json" }
        });
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
        setOpen(false);
        if (link) router.push(link);
    };

    return (
        <div className="relative">
            <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-600" />
                )}
            </Button>

            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-80 z-50 rounded-md border border-border bg-popover text-popover-foreground shadow-md overflow-hidden">
                        <div className="flex justify-between items-center p-3 border-b">
                            <span className="font-semibold text-sm">Notifications</span>
                            <button
                                onMouseDown={async (e) => { e.preventDefault(); await fetch("/api/notifications", { method: "POST", body: "{}" }); await loadNotifications(); }}
                                className="text-xs text-primary hover:underline"
                            >
                                Mark all read
                            </button>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-4 text-center text-sm text-muted-foreground">No new notifications.</div>
                            ) : (
                                notifications.map(n => (
                                    <div
                                        key={n.id}
                                        onClick={() => markRead(n.id, n.link)}
                                        className={`p-3 text-sm border-b cursor-pointer hover:bg-muted transition-colors ${!n.isRead ? 'bg-primary/5' : ''}`}
                                    >
                                        <p className="font-medium text-foreground">{n.title}</p>
                                        <p className="text-muted-foreground text-xs mt-1">{n.message}</p>
                                        <p className="text-[10px] text-muted-foreground mt-2">{new Date(n.createdAt).toLocaleDateString()}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
