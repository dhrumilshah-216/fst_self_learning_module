"use client";

import { useActionState } from "react";
import { submitReview } from "@/actions/review.actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ReviewSection({
    projectId,
    experimentId,
    reviews,
    isSupervisor
}: {
    projectId: string,
    experimentId: string,
    reviews: any[],
    isSupervisor: boolean
}) {
    const [state, action, isPending] = useActionState(submitReview, null);

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Supervisor Reviews</h3>

            {reviews.length > 0 && (
                <div className="space-y-4">
                    {reviews.map((r, i) => (
                        <div key={i} className={`p-4 rounded-lg border text-sm ${r.status === 'APPROVED' ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-rose-500/50 bg-rose-500/10'}`}>
                            <div className="flex justify-between items-center mb-2">
                                <span className={`font-semibold ${r.status === 'APPROVED' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                    {r.status.replace("_", " ")}
                                </span>
                                <span className="text-muted-foreground text-xs">{new Date(r.reviewedAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-foreground">{r.comment || "No structural feedback provided."}</p>
                            <p className="text-xs text-muted-foreground mt-2">— {r.reviewer?.name}</p>
                        </div>
                    ))}
                </div>
            )}

            {isSupervisor && (
                <form action={action} className="space-y-3 pt-4 border-t">
                    <h4 className="font-medium text-sm">Submit Official Review</h4>
                    {state?.error && (
                        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                            {state.error}
                        </div>
                    )}
                    <input type="hidden" name="projectId" value={projectId} />
                    <input type="hidden" name="experimentId" value={experimentId} />

                    <Textarea name="comment" placeholder="Provide feedback (optional)" />

                    <div className="flex gap-3">
                        <Button type="submit" name="status" value="APPROVED" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isPending}>
                            Approve
                        </Button>
                        <Button type="submit" name="status" value="CHANGES_REQUESTED" variant="destructive" disabled={isPending}>
                            Request Changes
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
