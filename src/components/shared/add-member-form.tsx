"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addProjectMember } from "@/actions/membership.actions";

export function AddMemberForm({ projectId }: { projectId: string }) {
    const [state, action, isPending] = useActionState(addProjectMember, null);

    return (
        <form action={action} className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm mt-6">
            <h3 className="text-lg font-semibold mb-4">Add Project Member</h3>
            {state?.error && (
                <div className="mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                    {state.error}
                </div>
            )}
            {state?.success && (
                <div className="mb-4 rounded-md bg-emerald-500/15 p-3 text-sm text-emerald-600 dark:text-emerald-400">
                    Member successfully added or updated!
                </div>
            )}

            <input type="hidden" name="projectId" value={projectId} />

            <div className="flex gap-4 items-end">
                <div className="space-y-2 flex-1">
                    <Label htmlFor="email">User Email</Label>
                    <Input id="email" name="email" type="email" placeholder="colleague@university.edu" required />
                </div>
                <div className="space-y-2 flex-1">
                    <Label htmlFor="role">Role</Label>
                    <select
                        id="role"
                        name="role"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        <option value="MEMBER">Member</option>
                        <option value="LEAD">Lead</option>
                        <option value="SUPERVISOR">Supervisor</option>
                    </select>
                </div>
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Adding..." : "Add Member"}
                </Button>
            </div>
        </form>
    );
}
